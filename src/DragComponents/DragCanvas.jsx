import { Box, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import React from "react";

const DragCanvas = ({ elements = [], onselect }) => {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  return (
    <Box
      ref={setNodeRef}
      flex={1}
      bg={"blue.200"}
      borderRadius={"2xl"}
      overflow={"auto"}
      w={"300px"}
      h={"100vh"}
      border={"2px dashed gray"}
      p={4}
    >
      {elements?.length > 0 ? (
        elements.map((el) => (
          <Box
            key={el.id}
            onClick={() => onselect(el.id)}
            p={2}
            m={3}
            height={'2xs'}
            border="1px solid black"
            cursor="pointer"
            bg="gray.200"
            borderRadius="md"
            mb={2}
          >
            {el.content}
          </Box>
        ))
      ) : (
        <Text color="gray.500" textAlign="center">
          Drop Items here
        </Text>
      )}
    </Box>
  );
};

export default DragCanvas;
