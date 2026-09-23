import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import type { DesignElement } from "../../types/design";

interface CanvasElementProps {
  element: DesignElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (id: string, updates: Partial<DesignElement>) => void;
  onDelete: (id: string) => void;
  onEditingChange: (editing: boolean) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}

const MIN_SIZE = 48;
const clamp = (value: number, max: number) => Math.min(Math.max(value, 0), Math.max(max, 0));

const CanvasElement = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  onEditingChange,
  canvasRef,
}: CanvasElementProps) => {
  const dragOffset = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const editableRef = useRef<HTMLElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const isTextType =
    element.type === "heading" ||
    element.type === "paragraph" ||
    element.type === "button";

  useEffect(() => {
    if (!isEditing || !editableRef.current) return;
    const node = editableRef.current;
    node.focus();
    const range = document.createRange();
    range.selectNodeContents(node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }, [isEditing]);

  // -------------------------
  // Drag
  // -------------------------

  const handlePointerDown = (event: React.PointerEvent) => {
    if (isEditing) return;
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    onSelect(element.id);

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    dragOffset.current = {
      x: event.clientX - canvasRect.left - element.x,
      y: event.clientY - canvasRect.top - element.y,
    };
  };

  const handlePointerMove = (event: React.PointerEvent) => {
    if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
      return;
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    if (!canvasRect) return;

    const rawX = event.clientX - canvasRect.left - dragOffset.current.x;
    const rawY = event.clientY - canvasRect.top - dragOffset.current.y;

    onUpdate(element.id, {
      x: clamp(rawX, canvasRect.width - element.width),
      y: clamp(rawY, canvasRect.height - element.height),
    });
  };

  const handlePointerUp = (event: React.PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  // -------------------------
  // Resize
  // -------------------------

  const handleResizePointerDown = (event: React.PointerEvent) => {
    event.stopPropagation();
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
    resizeStart.current = {
      x: event.clientX,
      y: event.clientY,
      width: element.width,
      height: element.height,
    };
  };

  const handleResizePointerMove = (event: React.PointerEvent) => {
    if (!(event.currentTarget as HTMLElement).hasPointerCapture(event.pointerId)) {
      return;
    }

    const canvasRect = canvasRef.current?.getBoundingClientRect();
    const deltaX = event.clientX - resizeStart.current.x;
    const deltaY = event.clientY - resizeStart.current.y;

    const maxWidth = canvasRect ? canvasRect.width - element.x : Infinity;
    const maxHeight = canvasRect ? canvasRect.height - element.y : Infinity;

    onUpdate(element.id, {
      width: Math.min(Math.max(MIN_SIZE, resizeStart.current.width + deltaX), maxWidth),
      height: Math.min(Math.max(MIN_SIZE, resizeStart.current.height + deltaY), maxHeight),
    });
  };

  const handleResizePointerUp = (event: React.PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (target.hasPointerCapture(event.pointerId)) {
      target.releasePointerCapture(event.pointerId);
    }
  };

  // -------------------------
  // Inline text editing
  // -------------------------

  const startEditing = (event: React.MouseEvent) => {
    if (!isTextType) return;
    event.stopPropagation();
    setIsEditing(true);
    onEditingChange(true);
  };

  const stopEditing = (event: React.FocusEvent<HTMLElement>) => {
    setIsEditing(false);
    onEditingChange(false);
    onUpdate(element.id, { content: event.currentTarget.textContent ?? "" });
  };

  const baseProps = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
    onDoubleClick: startEditing,
  };

  const editableProps = isEditing
    ? {
        ref: (el: HTMLElement | null) => {
          editableRef.current = el;
        },
        contentEditable: true,
        suppressContentEditableWarning: true,
        onBlur: stopEditing,
        onPointerDown: (event: React.PointerEvent) => event.stopPropagation(),
      }
    : {};

  let content;

  switch (element.type) {
    case "heading":
      content = (
        <h1
          {...baseProps}
          {...editableProps}
          className="flex h-full w-full items-center break-words px-2 text-3xl font-semibold leading-tight text-zinc-900 outline-none"
        >
          {element.content}
        </h1>
      );
      break;

    case "paragraph":
      content = (
        <p
          {...baseProps}
          {...editableProps}
          className="flex h-full w-full items-start break-words px-2 py-1 text-base leading-relaxed text-zinc-600 outline-none"
        >
          {element.content}
        </p>
      );
      break;

    case "button":
      content = (
        <div
          {...baseProps}
          {...editableProps}
          role="button"
          tabIndex={0}
          className="flex h-full w-full items-center justify-center rounded-md bg-indigo-600 px-4 text-sm font-medium text-white outline-none transition-colors hover:bg-indigo-500"
        >
          {element.content}
        </div>
      );
      break;

    case "image":
      content = (
        <div {...baseProps} className="h-full w-full overflow-hidden rounded-md bg-zinc-100">
          <img
            src="https://placehold.co/600x400?text=Image"
            alt=""
            draggable={false}
            className="h-full w-full select-none object-cover"
          />
        </div>
      );
      break;

    case "container":
      content = (
        <div
          {...baseProps}
          className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-zinc-300 bg-zinc-50/60 text-sm text-zinc-400"
        >
          Container
        </div>
      );
      break;

    default:
      return null;
  }

  return (
    <div
      className="absolute"
      style={{
        left: element.x,
        top: element.y,
        width: element.width,
        height: element.height,
        userSelect: isEditing ? "text" : "none",
      }}
    >
      <div
        className={`h-full w-full rounded-md ${
          isSelected ? "outline outline-2 outline-offset-2 outline-indigo-500" : ""
        }`}
      >
        {content}
      </div>

      {isSelected && !isEditing && (
        <>
          <button
            type="button"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onDelete(element.id)}
            aria-label="Delete element"
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm transition-colors hover:bg-red-400"
          >
            <X className="h-3 w-3" strokeWidth={2.5} />
          </button>

          <div
            onPointerDown={handleResizePointerDown}
            onPointerMove={handleResizePointerMove}
            onPointerUp={handleResizePointerUp}
            className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize rounded-sm bg-indigo-500"
          />
        </>
      )}
    </div>
  );
};

export default CanvasElement;