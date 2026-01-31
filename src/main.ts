import type { ToolSet } from "ai";
import { stepCountIs, streamText, tool } from "ai";
import { argv } from "node:process";
import { z } from "zod/v4";
import {
  defaultSummarizer,
  systemPrompt,
  ycombinatorSummarizer,
} from "./prompt/summerizer.ts";
import { writeSummaryToFile } from "./write/writer.ts";

const NumberOfArticleSchema = z.coerce
  .number()
  .min(1)
  .max(6)
  .default(5)
  .describe("Number of articles to summarize (1-6)");

const tools: ToolSet = {
  summarize: tool({
    description: "Scrapes the text content of a website given its URL.",
    inputSchema: z.object({
      url: z.url().describe("The URL of the article to summarize"),
      numberOfArticles: z
        .number()
        .describe("The number of articles to summarize"),
    }),
    execute: async ({ url }) => {
      // Example using a simple fetch/Markdown converter
      const fixUrl = url.startsWith("https") ? url : `https://${url}`;
      const response = await fetch(`${fixUrl}/`);
      const text = await response.text();
      return { content: text };
    },
  }),
};
async function summarizeArticles(
  url: string,
  numberOfArticles: number,
): Promise<string> {
  let summarizer;
  if (url.includes("news.ycombinator.com")) {
    console.log("Using special prompt for Hacker News...");
    summarizer = streamText({
      model: "gpt-4o-mini",
      tools,
      prompt: ycombinatorSummarizer(url, numberOfArticles),
      system: systemPrompt,
      stopWhen: stepCountIs(5),
    });
  } else {
    summarizer = streamText({
      model: "gpt-4o-mini",
      tools,
      prompt: defaultSummarizer(url, numberOfArticles),
      system: systemPrompt,
      stopWhen: stepCountIs(5),
    });
  }
  const chunks: string[] = [];
  for await (const chunk of summarizer.textStream) {
    process.stdout.write(chunk);
    chunks.push(chunk);
  }

  process.stdout.write("\n");
  const text = chunks.join("");
  return text.trim();
}

// select x articles from Hacker News and summarize them
// from input
async function main() {
  const my_url = argv[2] || "https://news.ycombinator.com/";
  const numberOfArticles = NumberOfArticleSchema.parse(argv[3]);
  if (!my_url) {
    throw new Error("Please provide a URL as a command-line argument.");
  }
  const noteLocation = process.env.NOTE_LOCATION;
  if (!noteLocation) {
    console.warn("NOTE_LOCATION is not set. Skipping file write.");
    return;
  }
  const summary = await summarizeArticles(my_url, numberOfArticles);
  console.log(summary);
  void writeSummaryToFile(summary, noteLocation);
}

void main().catch(console.error);
