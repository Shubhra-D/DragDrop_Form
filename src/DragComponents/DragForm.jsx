import {
  Box,
  Button,
  HStack,
  IconButton,
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
import { FaHamburger } from "react-icons/fa";
import { FaCross } from "react-icons/fa6";

const DragForm = () => {
  const GRID_SIZE = 20;
  const [elements, setElements] = useState(() => {
    return JSON.parse(localStorage.getItem("elements")) || [];
  });
  const [selectedId, setSelectedId] = useState(null);
  const [formValues, setFormValues] = useState(() => {
    return JSON.parse(localStorage.getItem("formValues")) || {};
  });

  const [dragging, setDragging] = useState(false);
  const [sidebarOpen, setSideBarOpen] = useState(true);
  useEffect(() => {
    localStorage.setItem("formValues", JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    localStorage.setItem("elements", JSON.stringify(elements));
  }, [elements]);

  const handleDragEnd = (event) => {
    const { active, delta, over } = event;
    if (!active || !over) return;

    if (over.id === "canvas") {
      // Check if dropped in the drop area
      const existingElement = elements.find((e) => e.id === active.id);

      if (!existingElement) {
        // Create a new element when dragged from the sidebar
        const newElement = {
          id: active.id + Date.now(), // Unique ID for multiple instances
          type: active.id, // "Text", "Button", or "Image"
          content: active.id === "Image" ? "" : active.id, // Default text for non-image
          x: 50, // Default position
          y: 50,
        };

        setElements((prev) => [...prev, newElement]);
      } else {
        // If element exists, update its position (grid-snapped)
        const snappedX = Math.max(
          0,
          Math.min(
            window.innerWidth - 100,
            Math.round(event.delta.x / GRID_SIZE) * GRID_SIZE
          )
        );
        const snappedY = Math.max(
          0,
          Math.min(
            window.innerHeight - 100,
            Math.round(event.delta.y / GRID_SIZE) * GRID_SIZE
          )
        );

        setElements((prev) =>
          prev.map((e) =>
            e.id === active.id ? { ...e, x: snappedX, y: snappedY } : e
          )
        );
      }
    }
    setDragging(false);
  };
  const handleSelect = (id) => {
    setTimeout(() => {
      if (!dragging) {
        setSelectedId(id);
      }
    }, 200);
  };

  const handleInputChange = (e) => {
    setFormValues({ ...formValues, [selectedId]: e.target.value });

    setElements((prev) =>
      prev.map((el) =>
        el.id === selectedId ? { ...el, content: e.target.value } : el
      )
    );
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

  //handle sidebar
  const toggleSidebar = () => setSideBarOpen((prev) => !prev);
  return (
    <DndContext onDragEnd={handleDragEnd} onDragStart={() => setDragging(true)}>
      <Box
        display={"flex"}
        flexDirection={{ base: "column", md: "row" }}
        height={"100vh"}
      >
        {/* Sidebar for draggo items */}
        <Box
          position={{ base: "absolute", md: "static" }}
          left={sidebarOpen ? "0" : "-260px"}
          top="0"
          height={'100vh'}
          width={'250px'}
          p={4}
          bg={"blue.500"}
          borderRadius={{ md: "2xl" }}
          boxShadow={{ base: "lg", md: "none" }}
          transition="left 0.3s ease-in-out"
          zIndex="1000"
        >
          {/* Close button for small screens */}
          <Button
            display={{ base: "block", md: "none" }}
            onClick={toggleSidebar}
            position="absolute"
            top="10px"
            right="10px"
            bg={"whiteAlpha.800"}
            size="sm"
          >
            ❌
          </Button>
          <VStack gap={3} marginTop={10} alignContent={'stretch'}>
            <DragItems id={"Text"} />
            <DragItems id="Button" />
            <DragItems id={"Image"} />
          </VStack>
        </Box>

        {/* Menu Button (Only on small screens) */}
        <Button
          display={{ base: "block", md: "none" }}
          position="absolute"
          top="15px"
          left="15px"
          zIndex="1100"
          onClick={toggleSidebar}
          size="md"
        >
          <FaHamburger colorPalette="green" />
        </Button>
        {/* CANVAS FOR DROP ITEMS */}
        <Box flex={1} overflow="auto" margin={2}  px={{ base: "16px", md: "24px" }}       py={{ base: "60px", md: "20px" }} >
          <DragCanvas
            elements={elements}
            onselect={handleSelect}
            setElements={setElements}
          />
        </Box>
        {selectedId && (
          <Box
            position={{ base: "relative", md: "absolute" }}
            top={{ md: "50%" }}
            right={{ md: "20px" }}
            transform={{ md: "translateY(-50%)" }}
            width={{ base: "100%", md: "60%" }}
            p={{ base: "2", md: "4" }}
            boxShadow={"lg"}
            borderRadius={"2xl"}
            borderColor={"blue.600"}
            bg={"blue.300"}
          >
            {elements.find((el) => el.id === selectedId)?.type === "Image" ? (
              <Input
                value={formValues[selectedId] || ""}
                onChange={handleInputChange}
                placeholder="Paste Image URL..."
                bg={"gray.300"}
                border={"none"}
                color={"gray.700"}
                marginBottom={2}
              />
            ) : (
              <Input
                value={formValues[selectedId] || ""}
                onChange={handleInputChange}
                placeholder="Write Here..."
                bg={"gray.300"}
                border={"none"}
                color={"gray.700"}
                marginBottom={2}
              />
            )}

            <NativeSelect.Root
              marginBottom={2}
              onChange={(e) => handlePropertyChange("bgColor", e.target.value)}
            >
              <NativeSelect.Field
                placeholder="Select background Color"
                bg={"gray.300"}
                border={"none"}
                color={"gray.700"}
              >
                <option value={"black"}>Black</option>
                <option value={"red"}>Red</option>
                <option value={"blue"}>Blue</option>
                <option value={"green"}>Green</option>
                <option value={"white"}>White</option>
              </NativeSelect.Field>
              <NativeSelectIndicator />
            </NativeSelect.Root>
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
                <option value={"white"}>White</option>
              </NativeSelect.Field>
              <NativeSelectIndicator />
            </NativeSelect.Root>
            <NativeSelect.Root
              onChange={(e) => handlePropertyChange("fontSize", e.target.value)}
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
                ❌Cancel
              </Button>
              <Button
                color={"whiteAlpha.900"}
                bg={"red.400"}
                onClick={handleDelete}
              >
                🗑️Delete
              </Button>
            </HStack>
          </Box>
        )}
      </Box>
    </DndContext>
  );
};

export default DragForm;
