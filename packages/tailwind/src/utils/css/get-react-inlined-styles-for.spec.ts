import type postcss from "postcss";
import { setupTailwind } from "../tailwindcss/setup-tailwind";
import { getReactInlinedStylesFor } from "./get-react-inlined-styles-for";

describe("getReactInlinedStylesFor()", () => {
	const tailwind = setupTailwind({});

	const className =
		"bg-red-500 sm:bg-blue-300 w-full md:max-w-[400px] my-custom-class";
	let root!: postcss.Root;

	beforeEach(() => {
		root = tailwind.createDefaultRoot();
		const tailwindRules = tailwind.generateRules(new Set(className.split(" ")));
		root.append(...tailwindRules);

		tailwind.processTailwindFeatures(root);
	});

	it("should only bring in styles from the single className", () => {
		expect(getReactInlinedStylesFor("bg-red-500", root)).toEqual({
			backgroundColor: "rgb(239 68 68 / var(--tw-bg-opacity, 1))",
		});

		expect(getReactInlinedStylesFor("w-full", root)).toEqual({
			width: "100%",
		});
	});
});
