import * as React from "react";
import { render } from "@testing-library/react";
import { CtaSection } from "./CtaSection";

describe("CtaSection", () => {
  it("renders title and button", () => {
    const { getByText } = render(
      <CtaSection
        title="Try React Email"
        buttonText="Get Started"
        buttonUrl="https://react.email"
      />
    );
    expect(getByText("Try React Email")).toBeInTheDocument();
    expect(getByText("Get Started")).toBeInTheDocument();
  });
});
