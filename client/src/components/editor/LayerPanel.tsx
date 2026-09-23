import type { ComponentType } from "react";
import {
  Square,
  Heading1,
  Text,
  MousePointerClick,
  Image as ImageIcon,
  Trash2,
} from "lucide-react";
import type { DesignElement, ElementType } from "../../types/design";

interface LayersPanelProps {
  elements: DesignElement[];
  selectedElementId: string | null;
  onSelectElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

const ICONS: Record<
  ElementType,
  ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  container: Square,
  heading: Heading1,
  paragraph: Text,
  button: MousePointerClick,
  image: ImageIcon,
};

const LayersPanel = ({
  elements,
  selectedElementId,
  onSelectElement,
  onDeleteElement,
}: LayersPanelProps) => {
  // Elements later in the array render on top, so show the frontmost first
  const layers = [...elements].reverse();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-l border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-3 px-1 text-xs font-medium text-zinc-500">Layers</h2>

      {layers.length === 0 ? (
        <p className="px-1 text-sm text-zinc-600">Nothing here yet.</p>
      ) : (
        <div className="flex flex-col gap-1">
          {layers.map((element) => {
            const isSelected = element.id === selectedElementId;
            const Icon = ICONS[element.type];

            return (
              <div
                key={element.id}
                onClick={() => onSelectElement(element.id)}
                className={`group flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm capitalize transition-colors ${
                  isSelected
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                <Icon
                  className="h-4 w-4 shrink-0 text-zinc-500"
                  strokeWidth={1.75}
                />
                <span className="flex-1 truncate">{element.type}</span>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDeleteElement(element.id);
                  }}
                  aria-label={`Delete ${element.type}`}
                  className="opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                >
                  <Trash2 className="h-3.5 w-3.5" strokeWidth={1.75} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
};

export default LayersPanel;