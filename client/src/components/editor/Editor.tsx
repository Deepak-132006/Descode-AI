import { useCallback, useEffect, useRef, useState } from "react";
import type { DesignElement, ElementType } from "../../types/design";
import { DEFAULT_CONTENT, DEFAULT_SIZE } from "../../types/design";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import LayersPanel from "./LayerPanel";

const Editor = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );
  // true while inline text on the canvas is being edited, so Delete/Backspace
  // edits the text instead of removing the whole element
  const isEditingText = useRef(false);

  const addElement = useCallback((type: ElementType) => {
    setElements((prev) => {
      const offset = (prev.length % 6) * 24;
      const size = DEFAULT_SIZE[type];
      const newElement: DesignElement = {
        id: `${type}-${Date.now()}`,
        type,
        x: 80 + offset,
        y: 80 + offset,
        width: size.width,
        height: size.height,
        content: DEFAULT_CONTENT[type],
      };
      return [...prev, newElement];
    });
  }, []);

  // Keep selection on the newest element without racing the state update above
  useEffect(() => {
    if (elements.length === 0) return;
    const last = elements[elements.length - 1];
    setSelectedElementId((current) => current ?? last.id);
  }, [elements]);

  const updateElement = useCallback(
    (id: string, updates: Partial<DesignElement>) => {
      setElements((prev) =>
        prev.map((el) => (el.id === id ? { ...el, ...updates } : el)),
      );
    },
    [],
  );

  const deleteElement = useCallback((id: string) => {
    setElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedElementId((current) => (current === id ? null : current));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isEditingText.current) return;
      if (
        (event.key === "Delete" || event.key === "Backspace") &&
        selectedElementId
      ) {
        event.preventDefault();
        deleteElement(selectedElementId);
      }
      if (event.key === "Escape") {
        setSelectedElementId(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedElementId, deleteElement]);

  return (
    <div className="flex h-screen flex-col bg-zinc-950">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-800 px-5">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-indigo-500" />
          <span className="text-sm font-medium text-zinc-100">
            Canvas Studio
          </span>
        </div>
        <span className="text-xs text-zinc-500">
          {elements.length} element{elements.length === 1 ? "" : "s"}
        </span>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Toolbar onAddElement={addElement} />

        <Canvas
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={updateElement}
          onDeleteElement={deleteElement}
          onEditingChange={(editing) => {
            isEditingText.current = editing;
          }}
        />

        <LayersPanel
          elements={elements}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onDeleteElement={deleteElement}
        />
      </div>
    </div>
  );
};

export default Editor;