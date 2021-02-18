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
        boxShadow="base"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        padding={5}
        pos="relative"
        w={"200px"}
        mx={1}
        mb={1}
        cursor="pointer"
        onMouseDown={() => handleCurrentIDChanged(id)}
      >
        <Text>{title === "" ? "Untitled Note" : title}</Text>
      </Box>
    </>
  );
};

export default NoteTabItem;
