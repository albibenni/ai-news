export const systemPrompt = ` You are a professional research assistant.
 When a user provides a URL to Hacker News, use the summarize tool to get the content.
    `;
const commonPrompt = `Provide a concise summary including:
  - The main headlines.
  - 5 lines max for each article.
  - The link to the article.
  `;

export const ycombinatorSummarizer = (
  url: string,
  numberOfArticles: number,
) => `Summarize the top ${numberOfArticles} articles from Hacker News at the given URL.
${commonPrompt}

  <>The articles are in the format:
  1. Title (link) by Author
  2. Title (link) by Author
  ...<>

  URL: ${url}

  Summary:`;

export const defaultSummarizer = (
  url: string,
  numberOfArticles: number,
) => `Summarize the top ${numberOfArticles} articles of the website at the given URL.
${commonPrompt}

  URL: ${url}

  Summary:`;
