import { shuffleArray } from "../utils.js";

export function useShuffle({ cards }: { cards: Array<{ front: string; back: string }> }) {
  console.log("Shuffling flashcards...");
  shuffleArray(cards);
  console.log("Flashcards shuffled.\n");
}
