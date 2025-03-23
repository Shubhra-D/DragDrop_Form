import { Box } from "@chakra-ui/react";
import { useDraggable } from "@dnd-kit/core";
import React from "react";

const DragItems = ({ id }) => {
  const { attributes, listeners, setNodeRef } = useDraggable({ id });

  return (
    <Box
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      p={2}
      border={"1px solid black"}
      mb={2}
      cursor={"grab"}
      bg={'blue.200'}
      borderRadius={'2xl'}
      textAlign={'center'}
    >
      {id}
    </Box>
  );
};

export default DragItems;
