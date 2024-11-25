import { convert } from "html-to-text";
import { pretty } from "./utils/pretty";
import { plainTextSelectors } from "./plain-text-selectors";
import type { Options } from "./options";
import { Destination, Renderer } from "./renderer/renderer";

export const render = async (
  element: React.ReactElement,
  options?: Options,
) => {
  const destination = new Destination();

  const request = Renderer.createRequest(
    element,
    null,
    {
      plugins: options?.plugins ?? [],
    },
    null,
    undefined,
  );
  Renderer.startWork(request);
  Renderer.startFlowing(request, destination);

  const html = await destination.promise();

  if (options?.plainText) {
    return convert(html, {
      selectors: plainTextSelectors,
      ...options.htmlToTextOptions,
    });
  }

  if (options?.pretty) {
    return pretty(html);
  }

  return html;
};
