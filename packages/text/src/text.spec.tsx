import { Text } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Text> component", () => {
    const actualOutput = render(<Text>Lorem ipsum</Text>);
    expect(actualOutput).toMatchSnapshot();
  });
});
