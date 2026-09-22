import { useRef } from "react";
import type { DesignElement } from "../../types/design";

interface CanvasElementProps {
  element: DesignElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdate: (
    id: string,
    updates: Partial<DesignElement>
  ) => void;
}

const CanvasElement = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: CanvasElementProps) => {
  const dragOffset = useRef({
    x: 0,
    y: 0,
  });

  const style = {
    position: "absolute" as const,
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
  };

  const selectionStyle = isSelected
    ? "outline outline-2 outline-blue-500"
    : "";

  const handlePointerDown = (
    event: React.PointerEvent
  ) => {
    event.stopPropagation();

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    onSelect(element.id);

    dragOffset.current = {
      x: event.clientX - element.x,
      y: event.clientY - element.y,
    };
  };

  const handlePointerMove = (
    event: React.PointerEvent
  ) => {
    if (
      !event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      return;
    }

    const newX =
      event.clientX - dragOffset.current.x;

    const newY =
      event.clientY - dragOffset.current.y;

    onUpdate(element.id, {
      x: newX,
      y: newY,
    });
  };

  const handlePointerUp = (
    event: React.PointerEvent
  ) => {
    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  };

  const elementProps = {
    style,
    className: selectionStyle,
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerUp,
  };

  switch (element.type) {
    case "heading":
      return (
        <h1 {...elementProps}>
          Build Something Amazing
        </h1>
      );

    case "paragraph":
      return (
        <p {...elementProps}>
          Create beautiful websites visually.
        </p>
      );

    case "button":
      return (
        <button {...elementProps}>
          Get Started
        </button>
      );

    case "image":
      return (
        <img
          {...elementProps}
          src="https://placehold.co/300x200"
          alt="Placeholder"
        />
      );

    case "container":
      return (
        <div {...elementProps}>
          Container
        </div>
      );

    default:
      return null;
  }
};

export default CanvasElement;