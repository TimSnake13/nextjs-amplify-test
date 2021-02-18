import { AiOutlineDelete, AiOutlinePlusSquare } from "react-icons/ai";
import { Button, Input, Text, Flex } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import NoteTabItem from "./NoteTabItem";
import { DataStore } from "aws-amplify";
import { Note } from "../../models";
import {
  deleteNoteOnCloud,
  fetchMyNotes,
  uploadNoteToCloud,
} from "./functions";

interface Props {
  userID: string;
}

const SlateJSNote = ({ userID }: Props) => {
  const [titleValue, setTitleValue] = React.useState("");
  const handleTitleChange = (event) => setTitleValue(event.target.value);
  const [contentValue, setContentValue] = React.useState("");
  const handleContentChange = (event) => setContentValue(event.target.value);

  const [currentNoteID, setCurrentNoteID] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const uploadToCloudAfterChange = 500; // Save to cloud after 500ms

  // Fetch notes on mount and overwrite local notes
  async function fetchData() {
    const _notes = await fetchMyNotes(userID);
    if (_notes) setNotes(_notes);
    else setNotes([]);
  }
  // TODO: Add updatedAt time comparison to determine which version to overwrite
  useEffect(() => {
    fetchData();
  }, [userID]);

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  // Upload changes in notes to cloud after a certain amount of time
  let timeoutID;
  useEffect(() => {
    const targetID = currentNoteID;
    timeoutID = setTimeout(
      () => handleUpdateTargetNoteContent(targetID),
      uploadToCloudAfterChange
    );
    return () => {
      clearTimeout(timeoutID);
    };
  }, [titleValue, contentValue]);

  // Update the content to selected note when selected/current note id changed
  function handleCurrentNoteIDChanged(id: string) {
    // Save current note data before switch note
    const targetID = currentNoteID;
    handleUpdateTargetNoteContent(targetID);

    setCurrentNoteID(id);
    const currentNote = notes.find((v) => v.id === id);
    setTitleValue(currentNote.title);
    setContentValue(currentNote.content);
  }

  function handleNewNote() {
    const newNote = new Note({
      title: "",
      content: "",
      userID,
      updatedAt: new Date().toISOString(),
    });
    // const n = await DataStore.save(newNote);
    setNotes((array) => [...array, newNote]);
    uploadNoteToCloud(newNote);
    // console.log("New Note Added:");
    // console.log(n);
  }

  function handleDeleteCurrentNote() {
    if (currentNoteID === "") return;
    const toDeleteID = currentNoteID;
    setNotes((array) => array.filter((n) => n.id !== toDeleteID));
    setCurrentNoteID(notes[0].id); // Change to the first note

    deleteNoteOnCloud(toDeleteID);
    // console.log("Deleted: ");
    // console.log(d);
  }

  function handleUpdateTargetNoteContent(targetNoteID = currentNoteID) {
    if (targetNoteID === "") {
      // console.warn("targetNoteID is empty");
      return;
    }
    // Update local state
    const targetNote = notes.find((item) => item.id === targetNoteID);
    if (
      targetNote.title === titleValue &&
      targetNote.content === contentValue
    ) {
      return;
    }
    const updatedNote = Note.copyOf(targetNote, (updated) => {
      (updated.title = titleValue),
        (updated.content = contentValue),
        (updated.updatedAt = new Date().toISOString());
    });
    setNotes((array) =>
      array.map((item) => (item.id === targetNoteID ? updatedNote : item))
    );

    uploadNoteToCloud(updatedNote);
  }

  return (
    <>
      <Flex direction="row" h={"100vh"} w="100%">
        <Flex direction="column" bg={"#E5E7EB"} pt={8} px={4}>
          {notes.map((note) => (
            <NoteTabItem
              key={note.id}
              id={note.id}
              title={note.title}
              selected={note.id === currentNoteID ? true : false}
              handleCurrentIDChanged={handleCurrentNoteIDChanged}
            />
          ))}
          <Button
            leftIcon={<AiOutlinePlusSquare />}
            onClick={() => handleNewNote()}
            variant="ghost"
            colorScheme="blue"
            mt={2}
          >
            New Note
          </Button>
          <Button
            onClick={() => fetchData()}
            variant="ghost"
            colorScheme="blue"
            mt={2}
          >
            Fetch Data
          </Button>
        </Flex>
        <div>
          <Text mb="8px">Title</Text>
          <Input
            value={titleValue}
            onChange={(e) => handleTitleChange(e)}
            placeholder="Title"
          />
          <Text mb="8px">Content</Text>
          <Input
            value={contentValue}
            onChange={handleContentChange}
            placeholder="Content"
          />
          <Button
            onClick={() => handleDeleteCurrentNote()}
            leftIcon={<AiOutlineDelete />}
            variant="outline"
          >
            Delete
          </Button>
        </div>
      </Flex>
    </>
  );
};

export default SlateJSNote;
