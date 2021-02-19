import { DataStore } from "aws-amplify";
import { Note } from "../../models";

export async function uploadNoteToCloud(note: Note) {
  const u = await DataStore.save(note);
  console.log("Saved");
  //   console.log(u);
}

export async function deleteNoteOnCloud(toDeleteID: string) {
  const d = await DataStore.delete(Note, (note) => note.id("eq", toDeleteID));
}

export async function fetchMyNotes(userID: string) {
  return await DataStore.query(Note, (c) => c.userID("eq", userID));
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

export const initialValue = [
  {
    type: "paragraph",
    children: [
      { text: "This is editable " },
      { text: "rich", bold: true },
      { text: " text, " },
      { text: "much", italic: true },
      { text: " better than a " },
      { text: "<textarea>", code: true },
      { text: "!" },
    ],
  },
  {
    type: "paragraph",
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: "bold", bold: true },
      {
        text:
          ", or add a semantically rendered block quote in the middle of the page, like this:",
      },
    ],
  },
  {
    type: "block-quote",
    children: [{ text: "A wise quote." }],
  },
  {
    type: "paragraph",
    children: [{ text: "Try it out for yourself!" }],
  },
];
