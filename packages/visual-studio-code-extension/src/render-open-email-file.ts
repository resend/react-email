import * as vscode from "vscode";

import * as path from "path";
import * as vm from "vm";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";

export type BuiltEmail =
  | {
      filename: string;
      html: string;
      text: string;
      valid: true;
    }
  | { valid: false };

export async function renderOpenEmailFile(
  activeEditor: vscode.TextEditor | undefined,
): Promise<BuiltEmail | undefined> {
  if (typeof activeEditor !== "undefined") {
    if (
      typeof activeEditor.document.fileName === "undefined" ||
      activeEditor.document.fileName.length === 0 ||
      activeEditor.document.getText().length === 0
    ) {
      return { valid: false };
    }

    const currentlyOpenTabFilePath = activeEditor.document.fileName; // actually a path not the name of the file
    const currentlyOpenTabFilename = path.basename(
      currentlyOpenTabFilePath,
      ".tsx",
    );

    try {
      const buildResult = await esbuild.build({
        bundle: true,
        entryPoints: [currentlyOpenTabFilePath],
        platform: "node",
        write: false,
        jsx: "automatic",
        loader: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          ".js": "jsx",
        },
        format: "cjs",
      });

      console.log(global);

      const fakeContext = {
        ...global,
        process: {
          env: {},
        },
        module: { exports: { default: undefined as unknown } },
        __filanem: currentlyOpenTabFilePath,
        __dirname: path.dirname(currentlyOpenTabFilePath),
      };

      try {
        vm.runInNewContext(buildResult.outputFiles[0].text, fakeContext, {
          filename: currentlyOpenTabFilePath,
        });
      } catch (exception) {
        throw exception;
      }

      if (typeof fakeContext.module.exports.default !== "function") {
        return {
          valid: false,
        };
      }

      const email = fakeContext.module.exports.default;

      const comp = email("PreviewProps" in email ? email.PreviewProps : {}); // this may come without a defualt which might cause problems
      const emailAsText = render(comp, {
        plainText: true,
        pretty: false,
      });

      const emailAsHTML = render(comp, { pretty: false });

      return {
        filename: currentlyOpenTabFilename,
        html: emailAsHTML,
        text: emailAsText,
        valid: true,
      };
    } catch (exception) {
      console.warn(
        "Exception happenned on rendering or building of an email, but maybe its because it just was invalid anyways",
        exception,
      );

      throw exception;
    }
  }

  return undefined;
}
