import { useState } from "react";
import type { DesignElement, ElementType } from "../../types/design";
import Toolbar from "./Toolbar";
import Canvas from "./Canvas";
import LayersPanel from "./LayerPanel";

const Editor = () => {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null,
  );

  const addElement = (type: ElementType) => {
    const newElement: DesignElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: 300,
      height: 100,
    };

    setElements((prev) => [...prev, newElement]);
  };

  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    setElements((prev) =>
      prev.map((element) =>
        element.id === id ? { ...element, ...updates } : element,
      ),
    );
  };
  return (
    <div className="flex h-screen bg-zinc-950">
      <LayersPanel
        elements={elements}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
      />

      <Toolbar onAddElement={addElement} />

      <Canvas
        elements={elements}
        selectedElementId={selectedElementId}
        onSelectElement={setSelectedElementId}
        onUpdateElement={updateElement}
      />
    </div>
  );
};

export default Editor;
