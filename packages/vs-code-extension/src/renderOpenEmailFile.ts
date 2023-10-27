import * as vscode from "vscode";

import { basename, join } from "path";
import { rm } from "fs/promises";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";

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
    const emailsDirectory = join(currentlyOpenTabFilePath, "..");

    const previewDirectory = join(emailsDirectory, extensionPreviewFolder);
    try {
      await esbuild.build({
        bundle: true,
        entryPoints: [currentlyOpenTabFilePath],
        platform: "node",
        write: true,
        outdir: previewDirectory,
      });

      const filename = basename(currentlyOpenTabFilePath, ".tsx");
      const templatePath = `${previewDirectory}/${filename}.js`;

      delete require.cache[templatePath];
      // we need to use require since it has a way to programatically invalidate its cache
      const email = require(templatePath);

      if (typeof email.default === "undefined") {
        return { valid: false };
      }

      const comp = email.default(email.default.PreviewProps ?? {}); // this may come without a defualt which might cause problems
      const emailAsText = render(comp, {
        plainText: true,
        pretty: false,
      });

      const emailAsHTML = render(comp, { pretty: false });
      await rm(previewDirectory, { recursive: true });

      return {
        filename,
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
