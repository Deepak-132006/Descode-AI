export type ElementType = | "container" | "heading" | "paragraph" | "button" | "image"

export interface DesignElement {
  id: string;
  type: ElementType;

  x: number;
  y: number;
  width: number;
  height: number;
}