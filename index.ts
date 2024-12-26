import { Direction, Edge, type Node } from "yoga-layout";
import { layout } from "./layout";
import { parse } from "./parser";
import PDFDocument from "pdfkit"
import fs from "fs"

const tree = parse(`
  <Node
    style={{
      alignContent: 'flex-start',
      flexWrap: 'wrap',
    }}>
    <Node style={{margin: 5, height: 50, width: 50}} />
    <Node style={{margin: 5, height: 50, width: 50}} />
    <Node style={{margin: 5, height: 50, width: 50}} />
    <Node style={{margin: 5, height: 50, width: 50}} />
  </Node>
`);

const root = layout(tree);
const pdf = new PDFDocument();
root.setHeight(pdf.page.height);
root.setWidth(pdf.page.width);
root.calculateLayout(undefined, undefined, Direction.LTR);

const colors = ["gray", "black", "red"]
let color = 0;

const draw = (node: Node, offsetX = 0, offsetY = 0) => {
  const { top, left, width, height } = node.getComputedLayout();
  const x = offsetX + left + node.getComputedMargin(Edge.Left) + node.getComputedPadding(Edge.Left);
  const y = offsetY + top + node.getComputedMargin(Edge.Top) + node.getComputedPadding(Edge.Top);
  pdf.rect(x, y, width, height)
    .fillAndStroke(colors[color++ % colors.length]);
  for (let i = 0; i < node.getChildCount(); i++) draw(node.getChild(i), x, y);
}

pdf.pipe(fs.createWriteStream("./test.pdf"));
draw(root);
pdf.end()
