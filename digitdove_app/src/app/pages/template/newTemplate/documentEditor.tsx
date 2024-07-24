import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  DragEndEvent,
  useSensors,
  DragOverlay,
  DragStartEvent,
  useDroppable,
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
import { useGlobalContext } from "@/app/providers/GlobalContext";
import draggableDivider from "./draggableDivider";
import DraggableDivider from "./draggableDivider";
import styled from "styled-components";
import { useFormat } from "@/app/providers/FormatContext";
import { useDndMonitor } from "@dnd-kit/core";
import { ElementType } from "./draggableButton";
import ReactQuill from "react-quill";
import UnifiedToolbar from "./unifiedToolbar";
import SideModuleMenu from "./sideModuleMenu";
import ModuleSVG from "../../../assets/template/module.svg";
export enum EditorItemTypes {
  TEXT_BLOCK,
  DIVIDER,
}

// Define TypeScript types for the components
export interface TextBlockProps extends BaseBlockProps {
  text: string;
  deltaString: string;
}

export interface BaseBlockProps {
  id: string;
  type: EditorItemTypes;
  [key: string]: any;
}

interface DocumentEditorProps {
  components: BaseBlockProps[];
  setComponents: React.Dispatch<React.SetStateAction<BaseBlockProps[]>>;
  activeId: number | null;
  setActiveId: React.Dispatch<React.SetStateAction<number | null>>;
}

// Document Editor Component
const DocumentEditor: React.FC<DocumentEditorProps> = (props) => {
  const { activeId, setActiveId, components, setComponents } = props;
  const { theme } = useTheme();
  const { format } = useFormat();
  const [title, setTitle] = useState<string>("Document Title");
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const { backendUrl } = useGlobalContext();

  const InsertionIndicator = styled.div`
  height: 4px;
  background-color: ${theme.brand500};
  opacity: 0.8;
  margin-left: 4px;
  margin-right: 4px;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 1px;
  border-radius: ${format.roundmd}
  transform: scale(1, 0.5);
`;
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

  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [activeEditor, setActiveEditor] = useState<ReactQuill | null>(null);

  useDndMonitor({
    onDragOver(event: DragEndEvent) {
      const { over } = event;
      if (over) {
        const overIndex = components.findIndex((item) => item.id === over.id);
        console.log("drag over, index:", overIndex, over.data.current);
        setOverIndex(overIndex !== -1 ? overIndex : components.length);
      } else {
        setOverIndex(null);
      }
    },
    onDragEnd(event: DragEndEvent) {
      setOverIndex(null);
      const { active, over } = event;
      console.log("drag end")
      if (typeof active.id === "string" && active.id.includes("draggableBtn")) {
        console.log("find new element");
        if (over) {
          let newIndex = over.id
            ? components.findIndex((item) => item.id === over.id)
            : components.length;
          if (newIndex === -1) {
            newIndex = components.length;
          }
          if (
            active.data.current &&
            active.data.current.type == ElementType.DIVIDER
          ) {
            addDivider(newIndex);
          } else if (
            active.data.current &&
            active.data.current.type == ElementType.TEXT
          ) {
            addTextBlock(newIndex);
          }
        }
      } else if (active.id !== over?.id) {
        setComponents((items) => {
          const oldIndex = items.findIndex((item) => item.id === active.id);
          const newIndex = items.findIndex((item) => item.id === over?.id);
          setActiveId(null);
          return arrayMove(items, oldIndex, newIndex);
        });
      }
    },
  });

  const addTextBlock = (index: number) => {
    const newTextBlock: TextBlockProps = {
      id: `text-block-${components.length + 1}`,
      text: "New Text Block",
      deltaString: "",
      type: EditorItemTypes.TEXT_BLOCK,
    };
    setComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      newComponents.splice(index, 0, newTextBlock);
      return newComponents;
    });
  };

  const addDivider = (index: number) => {
    const newDivider: BaseBlockProps = {
      id: `divider-block-${components.length + 1}`,
      type: EditorItemTypes.DIVIDER,
    };
    setComponents((prevComponents) => {
      const newComponents = [...prevComponents];
      newComponents.splice(index, 0, newDivider);
      return newComponents;
    });
  };

  const handleSaveTemplate = () => {
    const lastEdited = new Date().toLocaleString();
    const name = title;
    const paragraphs = components.map((component) => {
      if (component.type == EditorItemTypes.TEXT_BLOCK) {
        return component.deltaString;
      } else if (component.type == EditorItemTypes.DIVIDER) {
        return "divider";
      }
    });

    if (paragraphs.length < 1) {
      console.log("invalid document");
      return;
    }

    console.log("saving: ", name, paragraphs, lastEdited);

    fetch(`${backendUrl}/template/createTemplate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name: name,
        last_edited: lastEdited,
        paragraphs: paragraphs,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const { setNodeRef } = useDroppable({
    id: "editor",
  });

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div style={{ padding: "16px" }}>
      <div className="flex justify-between ">
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
      <div className="flex justify-between">
        <UnifiedToolbar editor={activeEditor} />
        <button onClick={toggleMenu} className="flex items-center p-1 gap-1" style={{border: '2px solid ' + theme.neutral1000, borderRadius: format.roundmd}}>
          <ModuleSVG/>
          Module
          </button>
      </div>

      <SideModuleMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
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

      <div ref={setNodeRef} id="editor">
        <SortableContext
          items={components}
          strategy={verticalListSortingStrategy}
        >
          <div
            style={{
              minHeight: "500px",
              border: "2px dashed gray",
              padding: "16px",
            }}
          >
            {components.map((component, index) => (
              <>
                {overIndex === index && <InsertionIndicator />}
                {activeId != Number(component.id) &&
                  component.type == EditorItemTypes.TEXT_BLOCK && (
                    <DraggableTextBlock
                      key={component.id}
                      id={component.id}
                      text={component.text}
                      onTextChange={handleTextChange}
                      setActiveEditor={setActiveEditor}
                      activeEditor={activeEditor!}
                    />
                  )}
                {component.type == EditorItemTypes.DIVIDER && (
                  <>
                    <DraggableDivider id={component.id} />
                  </>
                )}
              </>
            ))}
            {overIndex === components.length && <InsertionIndicator />}
          </div>
        </SortableContext>
      </div>
      {/* <DragOverlay>
          <img
            src={DragPlaceholder.src}
            alt="placeholder"
            style={{ width: "50px", height: "50px" }}
          />
        </DragOverlay> */}
    </div>
  );
};

export default DocumentEditor;
