import type { ComponentType } from "react";
import {
  Square,
  Heading1,
  Text,
  MousePointerClick,
  Image as ImageIcon,
} from "lucide-react";
import type { ElementType } from "../../types/design";

interface ToolbarProps {
  onAddElement: (type: ElementType) => void;
}

const TOOLS: {
  type: ElementType;
  label: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}[] = [
  { type: "container", label: "Container", icon: Square },
  { type: "heading", label: "Heading", icon: Heading1 },
  { type: "paragraph", label: "Paragraph", icon: Text },
  { type: "button", label: "Button", icon: MousePointerClick },
  { type: "image", label: "Image", icon: ImageIcon },
];

const Toolbar = ({ onAddElement }: ToolbarProps) => {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-3 px-1 text-xs font-medium text-zinc-500">
        Elements
      </h2>

      <div className="flex flex-col gap-1">
        {TOOLS.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            type="button"
            onClick={() => onAddElement(type)}
            className="group flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white active:bg-zinc-800"
          >
            <Icon
              className="h-4 w-4 text-zinc-500 transition-colors group-hover:text-indigo-400"
              strokeWidth={1.75}
            />
            {label}
          </button>
        ))}
      </div>

      <p className="mt-auto px-1 text-xs leading-relaxed text-zinc-600">
        Drag elements to move them, use the corner handle to resize, and
        double-click text to edit it.
      </p>
    </aside>
  );
};

export default Toolbar;