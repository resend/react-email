import { Button } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Button> component", () => {
    const actualOutput = render(
      <Button pX={20} pY={12} href="https://example.com" />
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
