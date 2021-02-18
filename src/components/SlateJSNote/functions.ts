import { DataStore } from "aws-amplify";
import { Note } from "../../models";

export async function uploadNoteToCloud(note: Note) {
  const u = await DataStore.save(note);
  //   console.log("Saved: ");
  //   console.log(u);
}

export async function deleteNoteOnCloud(toDeleteID: string) {
  const d = await DataStore.delete(Note, (note) => note.id("eq", toDeleteID));
}

export async function fetchMyNotes(userID: string) {
  const _notes = await DataStore.query(Note, (c) => c.userID("eq", userID));
  return _notes;
}

export function rearrangeNotesOrder(notes: Note[]) {
  const newNotes = [...notes];
  for (let i = 0; i < notes.length; i++) {
    for (let j = 0; j < notes.length; j++) {
      if (
        newNotes[i].updatedAt &&
        newNotes[j].updatedAt &&
        newNotes[i].updatedAt < newNotes[j].updatedAt
      ) {
        let temp = newNotes[i];
        newNotes[i] = newNotes[j];
        newNotes[j] = temp;
      }
    }
  }
  return newNotes;
}
