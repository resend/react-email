import { convertPropsIntoAttributes } from "../property-mapping";
import { ParentNode, Node } from "./node";

export class ElementNode extends ParentNode {
  private props: Record<string, unknown>;
  private internalTag: string;

  hidden = false;

  parent?: ParentNode;

  constructor(tag: string, props: Record<string, unknown>) {
    super(Symbol("ElementNode"), []);
    this.internalTag = tag;
    this.props = props;
  }

  get tag() {
    return this.internalTag;
  }

  get html() {
    if (this.hidden) return "";

    const attributes = convertPropsIntoAttributes(this.props);

    const attributePortion =
      attributes.trim().length > 0 ? ` ${attributes}` : "";

    // ignore children for void html elements
    if (
      /^(AREA|BASE|BR|COL|COMMAND|EMBED|HR|IMG|INPUT|KEYGEN|LINK|META|PARAM|SOURCE|TRACK|WBR)$/.test(
        this.internalTag.toUpperCase(),
      )
    ) {
      return `<${this.internalTag}${attributePortion}/>`;
    }

    let childrenPortion: string;

    if (
      "dangerouslySetInnerHTML" in this.props &&
      typeof this.props.dangerouslySetInnerHTML === "object" &&
      this.props.dangerouslySetInnerHTML !== null &&
      "__html" in this.props.dangerouslySetInnerHTML &&
      typeof this.props.dangerouslySetInnerHTML.__html === "string"
    ) {
      childrenPortion = this.props.dangerouslySetInnerHTML.__html;
    } else {
      childrenPortion = this.internalChildren
        .map((child) => child.html)
        .join("");
    }

    return `<${this.internalTag}${attributePortion}>${childrenPortion}</${this.internalTag}>`;
  }

  get children(): readonly Node[] {
    return this.internalChildren;
  }
}
