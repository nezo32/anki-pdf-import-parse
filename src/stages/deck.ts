import { Output } from "pdf2json";
import { YankiConnect } from "yanki-connect";

export async function useDeck({ data, anki }: { data: Output; anki: YankiConnect }) {
  console.log("Creating/Using Anki deck...");
  const deck = `! ${(data.Meta.Title as string) || "Untitled Deck"}`;
  const deckConfig = await anki.deck.getDeckConfig({ deck });
  if (!deckConfig) {
    await anki.deck.createDeck({ deck });
    console.log(`Created new deck: ${deck}\n`);
  } else {
    console.log(`Using deck: ${deck}\n`);
  }

  return deck;
}
