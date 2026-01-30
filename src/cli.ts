#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { config } from "dotenv";
import { existsSync } from "node:fs";
import { homedir } from "node:os";
import { join, resolve } from "node:path";

// 1. Try loading .env from the current working directory
const localEnvPath = resolve(process.cwd(), ".env");
if (existsSync(localEnvPath)) {
  try {
    config({ path: localEnvPath });
  } catch {
    // Silent fail
  }
}

// 2. If the key is not present, try loading from the global configuration
// Standard location: ~/.config/ai-news/.env
if (!process.env.AI_GATEWAY_API_KEY) {
  const homeDir = homedir();
  const globalConfigPath = join(homeDir, ".config", "ai-news", ".env");

  if (existsSync(globalConfigPath)) {
    try {
      config({ path: globalConfigPath });
    } catch {
      // Silent fail
    }
  }
}

// Import and run the main function
void import("./main.ts").catch(console.error);
