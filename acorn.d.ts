// It seems like acorn-jsx doesn't actually extend the Acorn types, so I found these here:
// https://github.com/newsuk/jest-lint/blob/master/types/acorn-jsx.d.ts (jest-lint to the rescue!)

import "acorn";

declare module "acorn" {

  type JSXIdentifier = {
    type: "JSXIdentifier";
    start: number;
    end: number;
    name: string;
  };

  type JSXExpressionContainer = {
    type: "JSXExpressionContainer";
    start: number;
    end: number;
    expression:
      | ArrayExpression
      | JSXElement
      | Identifier
      | Literal
      | ObjectExpression
      | UnaryExpression;
  };

  type Identifier = {
    type: "Identifier";
    start: number;
    end: number;
    name: string;
  };

  type Literal = {
    type: "Literal";
    start: number;
    end: number;
    value: string | boolean | number;
    raw: string;
  };

  type Property = {
    type: "Property";
    start: number;
    end: number;
    method: boolean;
    shorthand: boolean;
    computed: boolean;
    key: Literal;
    value: Literal;
    kind: "init";
  };

  type ObjectExpression = {
    type: "ObjectExpression";
    start: number;
    end: number;
    properties: Property[];
  };

  type UnaryExpression = {
    type: "UnaryExpression";
    start: number;
    end: number;
    operator: "-" | "+";
    prefix: boolean;
    argument: Literal;
  };

  type ArrayElement =
    | ArrayExpression
    | Identifier
    | JSXElement
    | Literal
    | ObjectExpression
    | UnaryExpression;

  type ArrayExpression = {
    type: "ArrayExpression";
    start: number;
    end: number;
    elements: ArrayElement[];
  };

  type JSXAttribute = {
    type: "JSXAttribute";
    start: number;
    end: number;
    name: JSXIdentifier;
    value: JSXExpressionContainer | Literal;
  };

  type JSXMemberExpression = {
    type: "JSXMemberExpression";
    start: number;
    end: number;
    object: JSXIdentifier;
    property: JSXIdentifier;
  };

  type JSXOpeningElement = {
    type: "JSXOpeningElement";
    start: number;
    end: number;
    attributes: JSXAttribute[];
    name: JSXIdentifier | JSXMemberExpression;
    selfClosing: false;
  };

  type JSXClosingElement = {
    type: "JSXClosingElement";
    start: number;
    end: number;
    name: JSXIdentifier;
  };

  type JSXElement = {
    type: "JSXElement";
    start: number;
    end: number;
    openingElement: JSXOpeningElement;
    closingElement: JSXClosingElement;
    children: JSXNode[];
  };

  type JSXText = {
    type: "JSXText";
    start: number;
    end: number;
    value: string;
    raw: string;
  };

  type JSXNode = JSXElement | JSXText;

  type ExpressionStatement = {
    type: "ExpressionStatement";
    start: number;
    end: number;
    expression: ArrayExpression | JSXElement;
  };

  type BlockStatement = {
    type: "BlockStatement";
    start: number;
    end: number;
    body: Object[];
  };

  export type AST = {
    type: "Program";
    start: number;
    end: number;
    body: Array<ExpressionStatement | BlockStatement>;
    sourceType: "script";
  };

  export function parse(input: string, options: Options): AST;
}
