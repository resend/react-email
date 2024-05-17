import { ElementNode } from "./element-node";
import { TextNode } from "./text-node";

describe("ElementNode", () => {
  it("should add and remove children comutatively", () => {
    const strong = new ElementNode('strong', { style: { color: '#fff' } });

    const span = new ElementNode('span', {});
    const name = new TextNode('Gabriel');
    span.appendChild(name);
    expect(span.html).toMatchSnapshot();
    span.removeChild(name);
    expect(span.html).toMatchSnapshot();
    span.appendChild(name);
    expect(span.html).toMatchSnapshot();

    strong.appendChild(span);
    expect(strong.html).toMatchSnapshot();
    strong.removeChild(span);
    expect(strong.html).toMatchSnapshot();
    strong.appendChild(span);
    expect(strong.html).toMatchSnapshot();

    const div = new ElementNode('div', { className: 'bg-red-500' });
    div.appendChild(strong);
    expect(div.html).toMatchSnapshot();
  });
});
