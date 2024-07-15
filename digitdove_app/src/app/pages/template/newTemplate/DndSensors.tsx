import type { PointerEvent } from "react";
import type { MouseEvent, KeyboardEvent } from 'react'
import { PointerSensor, PointerSensorOptions } from "@dnd-kit/core";
import {
    MouseSensor as LibMouseSensor,
    KeyboardSensor as LibKeyboardSensor
  } from '@dnd-kit/core'

/**
 * An extended "PointerSensor" that prevent some
 * interactive html element(button, input, textarea, select, option...) from dragging
 */
export class SmartPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown" as const,
            handler: ({ nativeEvent: event }: PointerEvent<Element>, { onActivation }: PointerSensorOptions) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target as Element)
                ) {
                    return false;
                }

                return true;
            },
        },
    ];
}

function isInteractiveElement(element: Element | null) {
    const interactiveElements = [
        "button",
        "input",
        "textarea",
        "select",
        "option",
        "section",
    ];
    if (
        element?.tagName &&
        interactiveElements.includes(element.tagName.toLowerCase())
    ) {
        return true;
    }

    return false;
}

export class MouseSensor extends LibMouseSensor {
    static activators = [
      {
        eventName: 'onMouseDown' as const,
        handler: ({ nativeEvent: event }: MouseEvent) => {
          return shouldHandleEvent(event.target as HTMLElement)
        }
      }
    ]
  }
  
  export class KeyboardSensor extends LibKeyboardSensor {
    static activators = [
      {
        eventName: 'onKeyDown' as const,
        handler: ({ nativeEvent: event }: KeyboardEvent<Element>) => {
          return shouldHandleEvent(event.target as HTMLElement)
        }
      }
    ]
  }
  
  function shouldHandleEvent(element: HTMLElement | null) {
    let cur = element
  
    while (cur) {
      if (cur.dataset && cur.dataset.noDnd) {
        return false
      }
      cur = cur.parentElement
    }
  
    return true
  }