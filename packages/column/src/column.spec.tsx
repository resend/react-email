import { Column } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Column> component", () => {
    const actualOutput = render(<Column>Lorem ipsum</Column>);
    expect(actualOutput).toMatchSnapshot();
  });
});
