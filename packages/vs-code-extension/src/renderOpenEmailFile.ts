import * as vscode from "vscode";

import { basename, join } from "path";
import { rm, unlink, writeFile } from "fs/promises";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";
import { existsSync } from "fs";

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

    const emailsDirectory = join(currentlyOpenTabFilePath, "..");
    const previewDirectory = join(emailsDirectory, extensionPreviewFolder);

    // this is necessary so that we can still build things in a stable way
    // and have a up-to date version of the email preview on the extension
    const currentlyOpenTabFilesPathWithCurrentContents = join(
      emailsDirectory,
      `${currentlyOpenTabFilename}.vscpreview.tsx`,
    );
    const currentContents = activeEditor.document.getText();
    await writeFile(
      currentlyOpenTabFilesPathWithCurrentContents,
      currentContents,
    );

    const builtFileWithCurrentContents = join(
      previewDirectory,
      `${currentlyOpenTabFilename}.js`,
    );

    try {
      await esbuild.build({
        bundle: true,
        entryPoints: [currentlyOpenTabFilesPathWithCurrentContents],
        platform: "node",
        write: true,
        outfile: builtFileWithCurrentContents,
      });

      if (existsSync(currentlyOpenTabFilesPathWithCurrentContents)) {
        await unlink(currentlyOpenTabFilesPathWithCurrentContents); // unlink the temporary file after building it
      }

      delete require.cache[builtFileWithCurrentContents];
      // we need to use require since it has a way to programatically invalidate its cache
      const email = require(builtFileWithCurrentContents);

      if (typeof email.default === "undefined") {
        // this means there is no "export default ..." in the file
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
