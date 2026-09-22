import type { DesignElement } from "../../types/design";

interface LayersPanelProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
}

const LayersPanel = ({
  elements,
  selectedElementId,
  onSelectElement,
}: LayersPanelProps) => {
  return (
    <aside className="w-52 border-r border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white">
        Layers
      </h2>

      <div className="space-y-1">
        {elements.map((element) => {
          const isSelected = element.id === selectedElementId;

          return (
            <button
              key={element.id}
              onClick={() => onSelectElement(element.id)}
              className={`w-full rounded px-3 py-2 text-left text-sm capitalize ${
                isSelected
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:bg-zinc-900"
              }`}
            >
              {element.type}
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default LayersPanel;