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
            content:
              "You will get the russian text, you need to add spaces, nothing more, just the spaces between words and after commas",
          },
          { role: "user", content: item.back },
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
