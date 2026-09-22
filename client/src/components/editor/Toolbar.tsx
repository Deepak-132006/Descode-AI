import type { ElementType } from "../../types/design";

interface ToolbarProps {
  onAddElement: (type: ElementType) => void;
}

const Toolbar = ({ onAddElement }: ToolbarProps) => {
  return (
    <aside className="w-52 border-r border-zinc-800 bg-zinc-950 p-4">
      <h2 className="mb-4 text-sm font-semibold text-white">
        Elements
      </h2>

      <div className="space-y-2">
        <button
          onClick={() => onAddElement("container")}
          className="w-full rounded bg-zinc-800 px-3 py-2 text-left text-sm text-white"
        >
          + Container
        </button>

        <button
          onClick={() => onAddElement("heading")}
          className="w-full rounded bg-zinc-800 px-3 py-2 text-left text-sm text-white"
        >
          + Heading
        </button>

        <button
          onClick={() => onAddElement("paragraph")}
          className="w-full rounded bg-zinc-800 px-3 py-2 text-left text-sm text-white"
        >
          + Paragraph
        </button>

        <button
          onClick={() => onAddElement("button")}
          className="w-full rounded bg-zinc-800 px-3 py-2 text-left text-sm text-white"
        >
          + Button
        </button>

        <button
          onClick={() => onAddElement("image")}
          className="w-full rounded bg-zinc-800 px-3 py-2 text-left text-sm text-white"
        >
          + Image
        </button>
      </div>
    </aside>
  );
};

export default Toolbar;