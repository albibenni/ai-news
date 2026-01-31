import fs from "fs/promises";

/**
 *
 * @param summary The summary text to write to file
 * @param noteLocation The directory where the note should be saved
 * @returns void
 */
export async function writeSummaryToFile(
  summary: string,
  noteLocation: string,
): Promise<string | undefined> {
  const filePath = noteLocation + `/hn_summary_${Date.now()}.md`;
  try {
    await fs.writeFile(filePath, summary, "utf-8");
    console.log(`Summary written to ${filePath}`);
    return filePath;
  } catch (error) {
    console.error("Error writing summary to file:", error);
  }
}
