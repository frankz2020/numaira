import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DraggableTextBlock from "./draggableText";
import { MouseSensor, SmartPointerSensor } from "./DndSensors";
import DragPlaceholder from "../../../assets/placeholder/dragPlaceholder.png";
import { useTheme } from "@/app/providers/ThemeContext";
import TemplateType from "../templateType";
const ItemTypes = {
  TEXT_BLOCK: "TEXT_BLOCK",
};

// Define TypeScript types for the components
interface TextBlockProps {
  id: string;
  text: string;
  deltaString: string;
}

interface DocumentEditorProps {}

// Document Editor Component
const DocumentEditor: React.FC<DocumentEditorProps> = () => {
  const { theme } = useTheme();
  const [components, setComponents] = useState<TextBlockProps[]>([]);
  const [title, setTitle] = useState<string>("Document Title");
  const [activeId, setActiveId] = useState<number | null>(null);
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over?.id);
        setActiveId(null);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as number);
  };

  const addTextBlock = () => {
    const newTextBlock: TextBlockProps = {
      id: `text-block-${components.length + 1}`,
      text: "New Text Block",
      deltaString: "",
    };
    setComponents((prevComponents) => [...prevComponents, newTextBlock]);
  };

  const handleTextChange = (
    id: string,
    newText: string,
    deltaString: string
  ) => {
    setComponents((prevComponents) =>
      prevComponents.map((component) =>
        component.id === id
          ? { ...component, text: newText, deltaString: deltaString }
          : component
      )
    );
  };

  const handleSaveTemplate = () => {
    const lastEdited = new Date().toLocaleString("en-US", {
      minute: "numeric",
    });
    const name = title;
    const paragraphs = components.map((component) => {
      return component.deltaString;
    });
    console.log("saving: ");
    const newTemplateData: TemplateType = {
      name: name,
      lastEdited: lastEdited.toString(),
      paragraphs: paragraphs,
    };
  };

  const sensors = useSensors({
    sensor: MouseSensor,
    options: {},
  });

  return (
    <div style={{ padding: "16px" }}>
      <div className="flex justify-between ">
        <button
          onClick={addTextBlock}
          className="cursor-pointer px-3 py-2 rounded"
          style={{
            marginBottom: "16px",
            cursor: "pointer",
            backgroundColor: theme.brand500,
            color: theme.neutral,
          }}
        >
          Add Text Block
        </button>
        <button
          className="cursor-pointer px-3 py-2 rounded"
          style={{
            marginBottom: "16px",
            cursor: "pointer",
            backgroundColor: theme.brand500,
            color: theme.neutral,
          }}
          onClick={handleSaveTemplate}
        >
          Save Template
        </button>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          fontSize: "24px",
          marginBottom: "16px",
          padding: "8px",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={components}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{
              minHeight: "400px",
              border: "2px dashed gray",
              padding: "16px",
            }}
          >
            {components.map((component) => (
              <>
                {activeId != Number(component.id) && (
                  <DraggableTextBlock
                    key={component.id}
                    id={component.id}
                    text={component.text}
                    onTextChange={handleTextChange}
                  />
                )}
              </>
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          <img
            src={DragPlaceholder.src}
            alt="placeholder"
            style={{ width: "50px", height: "50px" }}
          />
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default DocumentEditor;
