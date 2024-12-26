import type {
  JSXElement,
  JSXExpressionContainer,
  Literal,
  SpreadElement,
} from "acorn";
import type { TemplateLiteral } from "acorn";
import type { AnyNode, Expression, JSXNode } from "acorn";
import { Parser } from "acorn";
import jsx from "acorn-jsx";

export type Node =
  | boolean
  | string
  | {
      name: string;
      attributes: {
        name: string;
        value: Primatives;
      }[];
      children: Node[];
    };

type Primatives = string | number | bigint | boolean | RegExp | object | null | undefined;

const parser = Parser.extend(jsx({ allowNamespaces: false }));
export const parse = (input: string) => {
  const { body } = parser.parse(input, { ecmaVersion: "latest" });

  const root = body[0];
  if (root.type == "ExpressionStatement") {
    return readNode(root.expression);
  }

  throw new Error(`Could not parse JSX: ${root}`);
};

const readExpression = (
  expr:
    | Expression
    | SpreadElement
    | JSXElement
    | JSXExpressionContainer
    | Literal
    | null,
): Primatives => {
  if (expr == null) {
    return true;
  }

  if (expr.type == "Literal") {
    return expr.value;
  }

  if (expr.type == "JSXExpressionContainer") {
    return readExpression(expr.expression);
  }

  if (expr.type == "ArrayExpression") {
    return expr.elements.map((element) => readExpression(element));
  }

  if (expr.type == "TemplateLiteral") {
    const expressions = expr.expressions
      .filter((expression) => "value" in expression)
      .map((element) => element as TemplateLiteral)
      .map((element) => ({
        start: element.start,
        value: {
          cooked: readExpression(element),
          raw: (element as any).value,
        },
      }));
    const quasis = expr.quasis.map(({ start, value }) => ({
      start,
      value: { cooked: value.cooked, raw: value.raw },
    }));
    return expressions
      .concat(quasis)
      .sort((a, b) => a.start - b.start)
      .reduce(
        (string, element) => `${string}${element.value.cooked ?? ""}`,
        "",
      );
  }

  if (expr.type == "Identifier") {
    return expr.name;
  }

  if (expr.type === "ObjectExpression") {
    return expr.properties
      .filter((property) => property.type == "Property")
      .map((property) => {
        const key = readExpression(property.key) as string | number;
        const value = readExpression(property.value);

        if (key == undefined || value == undefined) {
          return null;
        }

        return { key, value };
      })
      .filter((property) => property != null)
      .reduce(
        (properties, property) => ({
          ...properties,
          [property.key]: property.value,
        }),
        {},
      );
  }
};

const readNode = (node: AnyNode | JSXNode | null): Node => {
  if (node == null) {
    return true;
  }

  if (node.type == "JSXElement") {
    const {
      openingElement: { name, attributes },
      children,
    } = node;

    if (name.type == "JSXIdentifier") {
      return {
        name: name.name,
        attributes: attributes.map(({ name, value }) => ({
          name: name.name,
          value: readExpression(value),
        })),
        children: children.map(readNode).filter((node) => node != ""),
      };
    }
  }

  // make sure it's not just a whitespace node
  if (node.type == "JSXText") {
    return !node.value.matchAll(/\s/g) ? node.value : "";
  }

  throw new SyntaxError(`Unsupported node type: ${node.type}`);
};
