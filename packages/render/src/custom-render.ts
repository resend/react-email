import { renderer } from "./renderer";
import { Root } from "./renderer/element-node";

export const render = (element: React.ReactElement) => {
  return new Promise<string>((resolve, reject) => {
    const root = new Root();

    const container = renderer.createContainer(
      root,
      0,
      null,
      false,
      false,
      "react-email-renderer",
      (error) => {
        reject(error);
      },
      null,
    ) as unknown;
    renderer.updateContainer(element, container, undefined, () => {
      resolve(root.html);
    });
  });
};
