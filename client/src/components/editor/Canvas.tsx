import type { DesignElement } from "../../types/design";
import CanvasElement from "./CanvasElements";

interface CanvasProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<DesignElement>) => void;
}

const Canvas = ({
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement
}: CanvasProps) => {
  return (
    <main className="flex-1 bg-zinc-900 p-8">
      <div
        className="relative mx-auto h-[700px] w-[1200px] overflow-hidden rounded-lg bg-white"
        onClick={() => onSelectElement(null)}
      >
        {elements.map((element) => (
          <CanvasElement
            key={element.id}
            element={element}
            isSelected={element.id === selectedElementId}
            onSelect={onSelectElement}
            onUpdate={onUpdateElement}
          />
        ))}
      </div>
    </main>
  );
};

export default Canvas;
