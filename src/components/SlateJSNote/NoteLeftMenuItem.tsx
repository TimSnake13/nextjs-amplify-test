import React from "react";
import { Box, Text } from "@chakra-ui/react";

interface Props {
  id: string;
  title: string;
  selected: boolean;
  handleCurrentIDChanged: (id: string) => void;
}

const NoteTabItem = ({
  id,
  title,
  selected,
  handleCurrentIDChanged,
}: Props) => {
  return (
    <>
      <Box
        bg={selected ? "teal.500" : "grey.600"}
        color={selected ? "white" : "black"}
        boxShadow={selected && "base"}
        borderBottom={!selected && "1px"}
        borderColor="gray.200"
        borderRadius="md"
        px={5}
        py={3}
        pos="relative"
        w={"200px"}
        mx={1}
        mb={1}
        cursor="pointer"
        onMouseDown={() => handleCurrentIDChanged(id)}
        transition={"background-color ease-out 0.2s, color ease-in 0.3s"}
      >
        <Text>{title === "" ? "Title" : title}</Text>
      </Box>
    </>
  );
};

export default NoteTabItem;
