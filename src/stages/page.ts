import { Page } from "pdf2json";
import { SingleBar } from "cli-progress";

const isNumber = (value: unknown) => !isNaN(Number(value));
function containsRussian(text: string) {
  return /[\p{Script=Cyrillic}]/u.test(text);
}

export function processPage({ page, bar }: { page: Page; bar: SingleBar }) {
  const mappedTexts = page.Texts.map((el) => el.R[0].T);

  mappedTexts.splice(0, 9);

  const startIndex = mappedTexts.findIndex((text) => text.includes("Версия:"));
  mappedTexts.splice(startIndex);

  const splittedTexts = [];

  const lastValue = { front: "", back: "" };
  for (let i = 0; i < mappedTexts.length; i++) {
    const value = mappedTexts[i];
    const nextValue = i + 1 < mappedTexts.length ? mappedTexts[i + 1] : null;

    if (nextValue && isNumber(nextValue)) {
      lastValue.back = value.trim();
      lastValue.front = lastValue.front.slice(0, -1).trim();
      lastValue.back.replace("・", "");
      if (lastValue.front && lastValue.back) splittedTexts.push({ ...lastValue });
      lastValue.front = "";
      lastValue.back = "";
      continue;
    }

    if (isNumber(value)) {
      continue;
    }

    if (containsRussian(value)) {
      lastValue.back += value.trim() + " ";
    } else {
      lastValue.front += value.trim() + "／";
    }
  }

  bar.increment();
  return splittedTexts;
}
