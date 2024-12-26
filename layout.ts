import Yoga, { Align, Edge, Wrap, type Node as YogaNode } from "yoga-layout";
import type { Attribute, Node } from "./parser";

type Nullable<T> = { [K in keyof T]: T[K] | undefined };
type Margin = number | "auto" | `${number}%`;
type Padding = number | `${number}%`;
type Style = Nullable<{
  width: number;
  height: number;
  flex: number;
  rowGap: number;
  alignContent: Align;
  flexWrap: Wrap;
  padding: Padding;
  margin: Margin;
  marginLeft: Margin,
  marginRight: Margin,
  marginTop: Margin,
  marginBottom: Margin,
}>;

const readAttribute = <T>(attributes: Attribute[], name: string) => {
  const attribute = attributes.find((attr) => attr.name == name);
  if (attribute && typeof attribute.value == "object") {
    return attribute.value as T;
  }
  return null;
};

export const layout = (tree: Node) => {
  const helper = (parent: YogaNode | null, node: Node, index: number) => {
    const child = Yoga.Node.create();
    if (typeof node == "object" && "children" in node) {
      const style = readAttribute<Style>(node.attributes, "style");
      if (style) {
        const { width, height, flex, padding, margin, marginTop, marginLeft, marginRight, marginBottom alignContent, flexWrap } =
          style;
        child.setWidth(width);
        child.setHeight(height);
        child.setFlex(flex);
        child.setPadding(Edge.All, padding);
        child.setMargin(Edge.All, margin);
        child.setMargin(Edge.Left, marginLeft);
        child.setMargin(Edge.Right, marginRight);
        child.setMargin(Edge.Top, marginTop);
        child.setMargin(Edge.Bottom, marginBottom);
        child.setMargin(Edge.All, margin);
        if (alignContent) child.setAlignContent(alignContent);
        if (flexWrap) child.setFlexWrap(flexWrap);
      }

      node.children.forEach((n, i) => helper(child, n, i));
    }
    if (parent) parent.insertChild(child, index);
    return child;
  };
  return helper(null, tree, 0);
};
