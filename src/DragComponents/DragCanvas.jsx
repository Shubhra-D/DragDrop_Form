import { Box, Text } from "@chakra-ui/react";
import { useDroppable } from "@dnd-kit/core";
import React, { useEffect } from "react";
import { ResizableBox } from "react-resizable";
import 'react-resizable/css/styles.css'

const DragCanvas = ({ elements = [], onselect, setElements }) => {
  const { setNodeRef } = useDroppable({ id: "canvas" });
  
  // Load saved elements on mount
  useEffect(() => {
    try {
      const savedElements = JSON.parse(localStorage.getItem("elements")) || [];
      const validElements = savedElements.map((el) => ({
        ...el,
        width: el.width || 100,
        height: el.height || 50,
      }));
      setElements(validElements);
    } catch (error) {
      console.error("Error parsing elements from localStorage", error);
      setElements([]);
    }
  }, [setElements]);

  // Update localStorage when elements change
  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

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
          <ResizableBox
            key={el.id}
            width={el.width || 100}
            height={el.height || 50}
            axis="both"
            resizeHandles={["se"]}
            onResizeStop={(event, data) => {
              setElements((prev) =>
                prev.map((item) =>
                  item.id === el.id
                    ? {
                        ...item,
                        width: data.size.width,
                        height: data.size.height,
                      }
                    : item
                )
              );
            }}
          >
            <Box
              onClick={() => onselect(el.id)}
              p={2}
              m={3}
              style={{
                backgroundColor: el.bgColor || "gray",
                color: el.color || "black",
                fontSize: el.fontSize || "16px",
                width: "100%",
                height: "100%",
              }}
              cursor="pointer"
              borderRadius="md"
            >
              {el.type === "Image" ? (
                <img src={el.content} alt="Image" width="100%" height="100%" />
              ) : (
                el.content
              )}
            </Box>
          </ResizableBox>
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
