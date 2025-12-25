import { SingleBar } from "cli-progress";
import OpenAI from "openai";

export async function useAI({
  cardData,
  openai,
  bar,
}: {
  cardData: Array<{ front: string; back: string }>;
  openai: OpenAI;
  bar: SingleBar;
}) {
  console.log("Refining flashcards using OpenAI...");
  bar.start(cardData.length, 0);

  const cards = await Promise.all(
    cardData.map(async (item) => {
      const response = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are a text formatter. The input is in Russian. Your ONLY task is to add spaces between words and after commas. Return ONLY the corrected text. Do not explain, do not add any instructions or messages.`,
          },
          {
            role: "user",
            content: `Format this Russian text by adding spaces between words and after commas: ${item.back}`,
          },
        ],
        model: "deepseek-chat",
      });

      const back = response.choices[0].message.content || item.back;
      bar.increment();

      return {
        ...item,
        back,
      };
    }),
  );

  bar.stop();
  console.log("Flashcards refined.\n");

  return cards;
}
