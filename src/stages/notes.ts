import { SingleBar } from "cli-progress";
import { YankiConnect } from "yanki-connect";

export async function useNotes({
  cards,
  anki,
  bar,
  deck,
}: {
  cards: Array<{ front: string; back: string }>;
  anki: YankiConnect;
  bar: SingleBar;
  deck: string;
}) {
  console.log("Adding flashcards to Anki...");
  bar.start(cards.length, 0);
  for (const card of cards) {
    const params: Parameters<typeof anki.note.addNote>[0] = {
      note: {
        deckName: deck,
        modelName: "Basic (and reversed card)",
        fields: {
          Front: card.front,
          Back: card.back,
        },
      },
    };

    const canAdd = await anki.note.canAddNotes({
      notes: [params.note],
    });
    if (!canAdd[0]) {
      bar.increment();
      continue;
    }

    await anki.note.addNote(params);
    bar.increment();
  }
  bar.stop();
  console.log(`Added ${cards.length} flashcards to Anki.\n`);
}
