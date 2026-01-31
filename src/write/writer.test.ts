import { it, describe, beforeAll, afterAll, expect } from "vitest";
import { mkdir, rm } from "fs";
import { readFile } from "fs/promises";
import { writeSummaryToFile } from "./writer.ts";

describe("writeSummaryToFile", () => {
  const noteLocation = "./test_output";
  beforeAll(() => {
    mkdir("./test_output", { recursive: true }, (err) => {
      if (err) throw err;
    });
  });
  afterAll(() => {
    rm("./test_output", { recursive: true, force: true }, (err) => {
      if (err) throw err;
    });
  });

  it("should write summary to file", async () => {
    const summary = "This is a test summary.";

    const filePath = await writeSummaryToFile(summary, noteLocation);
    expect(filePath).toBeDefined();
    expect(filePath).toContain(noteLocation);
    const file = await readFile(filePath!, {
      encoding: "utf-8",
    });
    expect(file).toContain(summary);
  });
});
