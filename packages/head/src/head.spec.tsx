import { Head } from "./index";
import { render } from "@react-email/render";

describe("render", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
  });

  it("renders the <Head> component", () => {
    const actualOutput = render(<Head />);
    expect(actualOutput).toMatchSnapshot();
  });

  it("renders children components", () => {
    const actualOutput = render(
      <Head>
        <title>My email title</title>
      </Head>
    );
    expect(actualOutput).toMatchSnapshot();
  });
});
