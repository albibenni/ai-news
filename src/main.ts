import type { ToolSet } from "ai";
import { stepCountIs, streamText, tool } from "ai";
import { argv } from "node:process";
import { z } from "zod/v4";

const systemPrompt = ` You are a professional research assistant.
 When a user provides a URL to Hacker News, use the summarize tool to get the content.
    `;
const commonPrompt = `Provide a concise summary including:
  - The main headlines.
  - 5 lines max for each article.
  - The link to the article.
  `;
const tools: ToolSet = {
  summarize: tool({
    description: "Scrapes the text content of a website given its URL.",
    inputSchema: z.object({
      url: z.url().describe("The URL of the article to summarize"),
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

async function main(): Promise<string> {
  const my_url = argv[2] || "https://news.ycombinator.com/";
  if (!my_url) {
    throw new Error("Please provide a URL as a command-line argument.");
  }
  let summarizer;
  if (my_url.includes("news.ycombinator.com")) {
    console.log("Using special prompt for Hacker News...");
    summarizer = streamText({
      model: "gpt-4o-mini",
      tools,
      prompt: `Summarize the top 5 articles from Hacker News at the given URL.
${commonPrompt}

  <>The articles are in the format:
  1. Title (link) by Author
  2. Title (link) by Author
  ...<>

  URL: ${my_url}

  Summary:`,
      system: systemPrompt,
      stopWhen: stepCountIs(5),
    });
  } else {
    summarizer = streamText({
      model: "gpt-4o-mini",
      tools,
      prompt: `Summarize the content of the website at the given URL.
${commonPrompt}

  URL: ${my_url}

  Summary:`,
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

void main().catch(console.error);
