import { YankiConnect } from "yanki-connect";

export async function useSync({ anki }: { anki: YankiConnect }) {
  console.log("Syncing Anki...");
  await anki.invoke("sync");
  console.log("Anki synced successfully.\n");
}
