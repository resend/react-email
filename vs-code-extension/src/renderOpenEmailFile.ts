import * as vscode from "vscode";

import * as crypto from "crypto";
import { basename, join } from "path";
import { tmpdir } from "os";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";
import { unlink } from "fs/promises";

const extensionPreviewFolder = ".vscpreview" as const;

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
    const currentlyOpenTabFilename = basename(currentlyOpenTabFilePath, ".tsx");

    // saves the temporary previews generated in the tmp folder
    const previewDirectory = join(tmpdir(), extensionPreviewFolder);

    // this hash is needed so the the import doesn't get from its cache
    const renderingHash = crypto.randomBytes(20).toString("hex");

    const builtFileWithCurrentContents = join(
      previewDirectory,
      `${currentlyOpenTabFilename}-${renderingHash}.js`,
    );

    try {
      await esbuild.build({
        bundle: true,
        entryPoints: [currentlyOpenTabFilePath],
        platform: "node",
        write: true,
        jsx: "automatic",
        format: "cjs",
        outfile: builtFileWithCurrentContents,
      });

      // for future people debugging this: if this doesnt update the preview, might be because import keeps a cache
      // and the hash is not being unique (unlikely though)
      const email = require(builtFileWithCurrentContents);

      if (typeof email.default === "undefined") {
        await unlink(builtFileWithCurrentContents);

        // this means there is no "export default ..." in the file
        return { valid: false };
      }

      const comp = email.default(email.default.PreviewProps ?? {}); // this may come without a defualt which might cause problems
      const emailAsText = render(comp, {
        plainText: true,
        pretty: false,
      });

      const emailAsHTML = render(comp, { pretty: false });

      await unlink(builtFileWithCurrentContents);

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
