export type ElementType =
  | "container"
  | "heading"
  | "paragraph"
  | "button"
  | "image";

export interface DesignElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
}

export const DEFAULT_CONTENT: Record<ElementType, string> = {
  container: "Container",
  heading: "Build Something Amazing",
  paragraph: "Create beautiful websites visually.",
  button: "Get Started",
  image: "",
};

export const DEFAULT_SIZE: Record<
  ElementType,
  { width: number; height: number }
> = {
  container: { width: 320, height: 200 },
  heading: { width: 420, height: 64 },
  paragraph: { width: 380, height: 80 },
  button: { width: 160, height: 48 },
  image: { width: 300, height: 200 },
};
