import Yoga, {Direction, Edge, FlexDirection, PositionType, type Node as YogaNode } from 'yoga-layout';
import { type Node } from "./parser";

export const layout = (tree: Node) => {
  const helper = (parent: YogaNode | null, node: Node, index: number) => {
    const child = Yoga.Node.create();
    if (typeof node == "object" && "children" in node) {
      node.children.forEach((n, i) => helper(child, n, i));
    }
    if (parent) parent.insertChild(child, index);
    return child;
  }
  return helper(null, tree, 0);
}
