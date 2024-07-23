// ElementType.ts

// DraggableButton.tsx
import React, { useEffect, useState } from 'react';
import { useDraggable, } from '@dnd-kit/core';
import { draggableStyle } from './draggbleCommons';

interface DraggableButtonProps {
  type: ElementType;
}

export enum ElementType {
    DIVIDER = 'divider',
    TEXT = 'text',
  }

  const DraggableButton: React.FC<DraggableButtonProps> = ({ type }) => {
    const [isDragging, setIsDragging] = useState(false);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: `draggableBtn-${type}`,
      data: { type },
    });
  
    useEffect(() => {
      if (!isDragging) {
        setTimeout(() => {
          const el = document.getElementById(`draggableBtn-${type}`);
          if (el) {
            el.style.transform = 'translate3d(0px, 0px, 0)';
          }
        }, 0);
      }
    }, [isDragging]);
  
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : '',
        ...draggableStyle,
      };
  
    const handleDragStart = () => {
        console.log('drag')
      setIsDragging(true);
    };
  
    const handleDragEnd = () => {
        console.log('drag end')
      setIsDragging(false);
    };
  
    return (
      <button
        id={`draggableBtn-${type}`}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onMouseUp={handleDragEnd}
      >
        {type === ElementType.DIVIDER ? 'Divider' : 'Text'}
      </button>
    );
  };
  
export default DraggableButton;
  