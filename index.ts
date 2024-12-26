import { Direction, Edge, type Node } from "yoga-layout";
import { layout } from "./layout";
import { parse } from "./parser";
import PDFDocument from "pdfkit"
import fs from "fs"

const render = (input: string) => {
  const pdf = new PDFDocument();
  const colors = ["gray", "black", "red"]
  let color = 0;
  const helper = (node: Node, offsetX = 0, offsetY = 0) => {
    const { top, left, width, height } = node.getComputedLayout();
    const x = offsetX + left + node.getComputedBorder(Edge.Left);
    const y = offsetY + top + node.getComputedBorder(Edge.Top);
    pdf.rect(x, y, width, height)
      .fillAndStroke(colors[color++ % colors.length]);
    for (let i = 0; i < node.getChildCount(); i++) helper(node.getChild(i), x, y);
  }

  const tree = parse(input);
  const root = layout(tree);
  root.setHeight(pdf.page.height);
  root.setWidth(pdf.page.width);
  root.calculateLayout(undefined, undefined, Direction.LTR);
  helper(root);
  return pdf;
}

const pdf = render(`
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

pdf.pipe(fs.createWriteStream("./output.pdf"));
pdf.end();
