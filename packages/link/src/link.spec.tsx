import { Link } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Link> component", () => {
    const actualOutput = render(
      <Link href="https://example.com">Example</Link>
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
