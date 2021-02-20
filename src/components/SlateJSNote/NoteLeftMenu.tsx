import { Flex, Text } from "@chakra-ui/react";
import React from "react";
import { AiOutlinePlusSquare } from "react-icons/ai";
import NoteLeftMenuItem from "./NoteLeftMenuItem";
import { Note } from "../../models";

interface Props {
  notes: Note[];
  currentNoteID: string;
  handleCurrentNoteIDChanged: (id: string) => void;
  createNewNote: () => void;
}

const NoteLeftMenu = ({
  notes,
  currentNoteID,
  handleCurrentNoteIDChanged,
  createNewNote,
}: Props) => {
  return (
    <>
      <Flex direction="column" bg={"grey.600"} pt={8} px={4}>
        {notes.map((note) => (
          <NoteLeftMenuItem
            key={note.id}
            id={note.id}
            title={note.title}
            selected={note.id === currentNoteID ? true : false}
            handleCurrentIDChanged={handleCurrentNoteIDChanged}
          />
        ))}
        <Flex
          align="center"
          cursor="pointer"
          onClick={() => createNewNote()}
          mt={3}
          mx={1}
          px={5}
        >
          <AiOutlinePlusSquare />
          <Text pl={3}>New Note</Text>
        </Flex>
        {/* <Button
            onClick={() => fetchDataAndOverWrite()}
            variant="ghost"
            colorScheme="blue"
            mt={2}
          >
            Fetch Data
          </Button> */}
      </Flex>
    </>
  );
};

export default NoteLeftMenu;
