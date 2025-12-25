import { SingleBar } from "cli-progress";
import { Output } from "pdf2json";
import { processPage } from "./page.js";

export async function usePages({ data, bar }: { data: Output; bar: SingleBar }) {
  console.log("Processing pages...");
  bar.start(data.Pages.length, 0);
  const res = (
    await Promise.all(data.Pages.map((page) => new Promise((res) => res(processPage({ page, bar })))))
  ).flat() as Array<{ front: string; back: string }>;
  bar.stop();
  console.log(`Processed ${res.length} flashcards.\n`);

  return res;
}
