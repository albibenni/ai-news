# AI News

AI news summarizer and article generator that uses AI to analyze and summarize content from news websites, with special support for Hacker News.

## Prerequisites

- Node.js (v23.6 or later)
- pnpm (v10.26.2 or later)
- AI SDK Key

## Setup

### 1. Install pnpm (if not already installed)

```bash
npm install -g pnpm
```

### 2. Configure pnpm (required for global linking)

```bash
pnpm setup
```

After running this, restart your terminal or run:

```bash
source ~/.zshrc  # or ~/.bashrc if using bash
```

### 3. Install dependencies

```bash
pnpm install
```

### 4. Create environment file

You can configure your API key in two ways:

#### Option 1: Local .env file (for development)

Create a `.env` file in the project root directory:

```bash
AI_GATEWAY_API_KEY=your_api_key_here
```

#### Option 2: Global config (for CLI usage)

Create a global config file at `~/.config/ai-news/.env`:

```bash
mkdir -p ~/.config/ai-news
echo "AI_GATEWAY_API_KEY=your_api_key_here" > ~/.config/ai-news/.env

# or
ln -s .env ~/.config/ai-news/ # to link the env from the project
```

The CLI will first check for a `.env` file in your current working directory, and if not found, fall back to the global config location. This allows you to use the `ai-news` command from anywhere without needing a local `.env` file.

**Note:** Make sure to add `.env` to your `.gitignore` to avoid committing sensitive API keys.

### 5. Fix pnpm store (if you encounter store version errors)

If you get a "Unexpected store location" error when linking globally:

```bash
pnpm install -g
```

This reinstalls global packages to use the correct store version.

## Usage

### Run locally

```bash
pnpm dev <url>
```

Example:

```bash
pnpm dev https://news.ycombinator.com/
```

### Install as global CLI

To use the `ai-news` command from anywhere:

```bash
pnpm link --global
```

Then you can run:

```bash
ai-news https://news.ycombinator.com/
```

## Features

- Scrapes and summarizes news articles from URLs
- Special handling for Hacker News format
- Provides concise summaries with:
  - Main headlines
  - Brief descriptions (3 lines max per article)
  - Author information
  - Links to articles

## Development

### Run tests

```bash
pnpm test
```

### Format code

```bash
pnpm indent:write
```

### Run AI SDK devtools

```bash
pnpm devtools
```
