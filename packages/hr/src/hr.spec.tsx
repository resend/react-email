import { Hr } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Hr> component", () => {
    const actualOutput = render(<Hr />);
    expect(actualOutput).toMatchSnapshot();
  });
});
