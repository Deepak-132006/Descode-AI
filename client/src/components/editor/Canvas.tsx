import { useRef } from "react";
import type { DesignElement } from "../../types/design";
import CanvasElement from "./CanvasElements";

interface CanvasProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
  onDeleteElement: (id: string) => void;
  onEditingChange: (editing: boolean) => void;
}

const Canvas = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  onEditingChange,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <main
      className="flex flex-1 items-center justify-center overflow-auto p-10"
      style={{
        backgroundColor: "#18181b",
        backgroundImage:
          "radial-gradient(circle, #27272a 1px, transparent 1px)",
        backgroundSize: "22px 22px",
      }}
    >
      <div
        ref={canvasRef}
        onPointerDown={(event) => {
          // Only deselect on the canvas background itself, not on bubbled
          // events from a child element being dragged
          if (event.target === event.currentTarget) {
            onSelectElement(null);
          }
        }}
        className="relative h-[700px] w-[1200px] shrink-0 overflow-hidden rounded-lg bg-white shadow-2xl ring-1 ring-black/10"
      >
        {elements.length === 0 && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-zinc-400">
              Add an element from the left to get started
            </p>
          </div>
        )}

        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onSelect={onSelectElement}
            onUpdate={onUpdateElement}
            onDelete={onDeleteElement}
            onEditingChange={onEditingChange}
            canvasRef={canvasRef}
          />
        ))}
      </div>
    </main>
  );
};

export default Canvas;