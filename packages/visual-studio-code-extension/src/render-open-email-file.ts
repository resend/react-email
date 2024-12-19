import * as vscode from "vscode";

import * as path from "path";

import { isFileAnEmail, renderEmailByPath } from "preview-utils";

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
    if (!isFileAnEmail(currentlyOpenTabFilePath)) {
      return { valid: false };
    }

    const currentlyOpenTabFilename = path.basename(
      currentlyOpenTabFilePath,
      ".tsx",
    );

    const result = await renderEmailByPath(currentlyOpenTabFilePath);

    if ("error" in result) {
      const err = new Error(result.error.message);
      err.stack = result.error.stack;
      err.name = result.error.name;
      err.cause = result.error.cause;
      throw err;
    }

    return {
      valid: true,
      filename: currentlyOpenTabFilename,
      html: result.markup,
      text: result.plainText,
    };
  }

  return undefined;
}
