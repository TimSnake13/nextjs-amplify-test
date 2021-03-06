import { AiOutlineDelete, AiOutlinePlusSquare } from "react-icons/ai";
import { Button, Input, Text, Flex, Box } from "@chakra-ui/react";

import React, { useEffect, useRef, useState } from "react";
import NoteTabItem from "./NoteLeftMenuItem";
import { Note } from "../../models";
import {
  deleteNoteOnCloud,
  fetchMyNotes,
  initialValue,
  rearrangeNotesOrder,
  uploadNoteToCloud,
} from "./utilities";
import { Node as SlateNode } from "slate";
import SlateEditor from "./SlateEditor";
import NoteLeftMenu from "./NoteLeftMenu";

interface Props {
  userID: string;
}

const SlateJSNote = ({ userID }: Props) => {
  const [titleValue, setTitleValue] = React.useState("");
  const handleTitleChange = (event) => setTitleValue(event.target.value);

  // Don't change contentValue directly, useEffect is setting it by JSON.stringify(slateValue)
  const [contentValue, setContentValue] = React.useState("");
  const [slateValue, setSlateValue] = useState<SlateNode[]>(initialValue);

  const [currentNoteID, setCurrentNoteID] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);

  const uploadToCloudAfterChange = 500; // Save to cloud after 500ms

  //TODO: first render is too quick, set first value is not working properly, still needs to click  the node

  /**
   *  Fetch notes from server and overwrite all local notes
   */
  async function fetchDataAndOverWrite() {
    const _notes = await fetchMyNotes(userID);
    if (_notes) {
      // Fetch new data && set default
      setNotes(_notes);
      handleCurrentNoteIDChanged(_notes[0].id);
    } else setNotes([]);
  }

  useEffect(() => {
    fetchDataAndOverWrite();
  }, []);

  useEffect(() => {
    setContentValue(JSON.stringify(slateValue));
  }, [slateValue]);

  useEffect(() => {
    console.log(notes);
  }, [notes]);

  // Upload changes in notes to cloud after a certain amount of time
  let timeoutID: NodeJS.Timeout;
  useEffect(() => {
    const targetID = currentNoteID;
    timeoutID = setTimeout(() => {
      saveTargetNoteContent(targetID);
    }, uploadToCloudAfterChange);
    return () => {
      clearTimeout(timeoutID);
    };
  }, [titleValue, contentValue]);

  /**
   * Save previous node date first,
   * then update the UI content to selected note by
   * using setCurrentNoteID() setTitleValue() setSlateValue()
   * @param id - The noteID needed to find the note in notes
   */
  function handleCurrentNoteIDChanged(id: string) {
    const targetID = currentNoteID;
    saveTargetNoteContent(targetID);

    setCurrentNoteID(id);
    const currentNote = notes.find((v) => v.id === id);
    if (currentNote) {
      setTitleValue(currentNote.title);
      try {
        if (currentNote.content) setSlateValue(JSON.parse(currentNote.content));
        else setSlateValue(initialValue);
      } catch (error) {
        console.error(error);
      }
    }
  }

  /**
   * Create a new note locally, push it to notes and upload to cloud
   */
  function createNewNote() {
    const newNote = new Note({
      title: "",
      content: "",
      userID,
      updatedAt: new Date().toISOString(),
    });
    setNotes((array) => [...array, newNote]);
    uploadNoteToCloud(newNote);
  }

  /**
   * Delete note using currentNoteID in notes and on cloud, then change currentNoteID to notes[0].id,
   * if don't exist, change currentNoteID to an empty string
   */
  function deleteCurrentNote() {
    if (currentNoteID === "") return;
    const toDeleteID = currentNoteID;
    setNotes((array) => array.filter((n) => n.id !== toDeleteID));
    setCurrentNoteID(notes[0].id ? notes[0].id : ""); // Change to the first note

    deleteNoteOnCloud(toDeleteID);
  }
  /**
   *  Find the target note in notes, update that using titleValue & contentValue.
   *  After that rearrangeNotesOrder().
   *  Then uploadNoteToCLoud().
   */
  function saveTargetNoteContent(targetNoteID = "") {
    if (targetNoteID === "") {
      return;
    }
    // Update local state
    const targetNote = notes.find((item) => item.id === targetNoteID);
    if (
      !targetNote ||
      (targetNote.title === titleValue && targetNote.content === contentValue)
    ) {
      return;
    }
    const updatedNote = Note.copyOf(targetNote, (updated) => {
      (updated.title = titleValue),
        (updated.content = contentValue),
        (updated.updatedAt = new Date().toISOString());
    });
    setNotes((array) =>
      rearrangeNotesOrder(
        array.map((item) => (item.id === targetNoteID ? updatedNote : item))
      )
    );

    uploadNoteToCloud(updatedNote);
  }

  return (
    <>
      <Flex direction="row" h={"100vh"} w="100%">
        <NoteLeftMenu
          notes={notes}
          currentNoteID={currentNoteID}
          handleCurrentNoteIDChanged={handleCurrentNoteIDChanged}
          createNewNote={createNewNote}
        />
        <Flex flexDirection="column" paddingX="12" w="100%" pt="12">
          <Flex flexDirection="row">
            <Input
              value={titleValue}
              onChange={(e) => handleTitleChange(e)}
              placeholder="Title"
              variant="unstyled"
              size="xl"
              fontSize={24}
              mb={4}
            />
          </Flex>
          {/* <SlateEditor
            slateValue={slateValue}
            setSlateValue={setSlateValue}
            deleteCurrentNote={deleteCurrentNote}
          /> */}
        </Flex>
      </Flex>
    </>
  );
};

export default SlateJSNote;
