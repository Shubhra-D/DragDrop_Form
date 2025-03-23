import {
  Box,
  Button,
  HStack,
  Input,
  NativeSelect,
  NativeSelectField,
  NativeSelectIndicator,
  VStack,
} from "@chakra-ui/react";
import { DndContext } from "@dnd-kit/core";
import React, { useEffect, useState } from "react";
import DragItems from "./DragItems";
import DragCanvas from "./DragCanvas";

const DragForm = () => {
  const [elements, setElements] = useState(() => {
    return JSON.parse(localStorage.getItem("elements")) || [];
  });
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState(() => {
    return JSON.parse(localStorage.getItem("formValues")) || {};
  });

  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const handleDragEnd = (event) => {
    const { active } = event;
    if (!active) return;
    //for delete zone
    if (over && over.id === "delete-zone") {
      handleDelete(active.id);
      return;
    }
    setElements((prev) => [
      ...prev,
      { id: `${active.id}-${Date.now()}`, type: active.id, content: "" },
    ]);
  };

  const handleRightClick = (e, id) => {
    e.preventDefault();
    const elementToDuplicate = elements.find((el) => el.id === id);
    if (elementToDuplicate) {
      setElements([
        ...elements,
        { ...elementToDuplicate, id: `${id}-copy-${Date.now()}` },
      ]);
    }
  };
  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [selectedId]: e.target.value });
  };

  const handlePropertyChange = (key, value) => {
    setElements(
      elements.map((e) => (e.id === selectedId ? { ...e, [key]: value } : e))
    );
  };
  const handleSave = () => {
    setElements(
      elements.map((e) =>
        e.id === selectedId ? { ...e, content: formValues[selectedId] } : e
      )
    );
    setSelectedId(null);
  };

  const handleCancel = () => {
    setFormValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[selectedId];
      return updatedValues;
    });
    setSelectedId(null);
  };

  const handleDelete = () => {
    setElements(elements.filter((el) => el.id !== selectedId));
    setFormValues((prev) => {
      const updatedValues = { ...prev };
      delete updatedValues[selectedId];
      return updatedValues;
    });
    setSelectedId(null);
  };
  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Box display={"flex"} flexDirection={"column"} height={"100vh"}>
        <Box display={"flex"} gap={4} flexGrow={1}>
          {/* Sidebar for draggo items */}
          <Box
            w={"200px"}
            p={4}
            bg={"blue.700"}
            borderRadius={"2xl"}
            marginLeft={2}
            borderRight={1}
          >
            <VStack gap={3}>
              <DragItems id={"Text"} />
              <DragItems id="Button" />
              <DragItems id={"Images"} />
            </VStack>
          </Box>
          <DragCanvas
            elements={elements}
            onRightClick={handleRightClick}
            onselect={setSelectedId}
          />
          {selectedId && (
            <Box
              position={"absolute"}
              top={"50%"}
              right={"20px"}
              transform={"translateY(-50%)"}
              p={4}
              boxShadow={"lg"}
              borderRadius={"2xl"}
              borderColor={"blue.600"}
              bg={"blue.300"}
            >
              <Input
                value={formValues[selectedId] || ""}
                onChange={handleInputChange}
                placeholder="Write Here..."
                bg={"gray.300"}
                border={"none"}
                color={"gray.700"}
                marginBottom={2}
              />
              <NativeSelect.Root
                marginBottom={2}
                onChange={(e) => handlePropertyChange("color", e.target.value)}
              >
                <NativeSelect.Field
                  placeholder="Select Color"
                  bg={"gray.300"}
                  border={"none"}
                  color={"gray.700"}
                >
                  <option value={"black"}>Black</option>
                  <option value={"red"}>Red</option>
                  <option value={"blue"}>Blue</option>
                  <option value={"green"}>Green</option>
                </NativeSelect.Field>
                <NativeSelectIndicator />
              </NativeSelect.Root>
              <NativeSelect.Root
                onChange={(e) =>
                  handlePropertyChange("fontSize", e.target.value)
                }
                colorPalette={"gray.300"}
              >
                <NativeSelectField
                  bg={"gray.300"}
                  border={"none"}
                  color={"gray.700"}
                  placeholder="Select Font Size"
                >
                  <option value={"16px"}>Small</option>
                  <option value={"20px"}>Medium</option>
                  <option value={"24px"}>Large</option>
                  <option value={"30px"}>X-Large</option>
                </NativeSelectField>
                <NativeSelectIndicator />
              </NativeSelect.Root>
              <HStack margin={2} gap={3}>
                <Button
                  onClick={handleSave}
                  color="whiteAlpha.900"
                  bg={"blue.500"}
                >
                  Save
                </Button>
                <Button
                  onClick={handleCancel}
                  color={"whiteAlpha.800"}
                  bg={"red.400"}
                >
                  Cancel
                </Button>
                <Button
                  color={"whiteAlpha.900"}
                  bg={"red.400"}
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </HStack>
            </Box>
          )}
        </Box>
        {/*  Trash Bin */}
        <Box
          id="delete-zone"
          p={4}
          textAlign={"center"}
          bg={"red.400"}
          color={"whiteAlpha.800"}
          cursor={"pointer"}
        >
          🗑️Delete
        </Box>
      </Box>
    </DndContext>
  );
};

export default DragForm;
