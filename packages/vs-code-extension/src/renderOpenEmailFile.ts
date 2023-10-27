import * as vscode from "vscode";

import { basename, join } from "path";
import { unlink } from "fs/promises";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";

const extensionPreviewFolder = '.vscpreview' as const;

export interface BuiltEmail {
  filename: string;
  html: string;
  text: string;
}

export async function renderOpenEmailFile<
  ActiveEditor extends vscode.TextEditor | undefined,
>(
  activeEditor: ActiveEditor,
): Promise<ActiveEditor extends undefined ? undefined : BuiltEmail> {
  if (activeEditor) {
    const currentlyOpenTabfilePath = activeEditor.document.fileName; // actually a path not the name of the file
    const emailsDirectory = join(currentlyOpenTabfilePath, "..");

    const previewDirectory = join(emailsDirectory, extensionPreviewFolder);
    await esbuild.build({
      bundle: true,
      entryPoints: [currentlyOpenTabfilePath],
      platform: "node",
      write: true,
      outdir: previewDirectory,
    });

    const filename = basename(currentlyOpenTabfilePath);
    const templatePath = `${previewDirectory}/${filename.replace(
      ".tsx",
      "",
    )}.js`;

    delete require.cache[templatePath];
    // we need to use require since it has a way to programatically invalidate its cache
    const email = require(templatePath);

    const comp = email.default(email.default.PreviewProps ?? {}); // this may come without a defualt which might cause problems
    const emailAsText = render(comp, {
      plainText: true,
      pretty: false,
    });
    const emailAsHTML = render(comp, { pretty: false });
    await unlink(templatePath);

    return {
      filename,
      html: emailAsHTML,
      text: emailAsText,
    } as unknown as ActiveEditor extends undefined ? undefined : BuiltEmail;
  }

  return undefined as unknown as ActiveEditor extends undefined
    ? undefined
    : BuiltEmail;
}