import { readFileSync } from "node:fs";
import * as vscode from "vscode";

let noEmailOpenHTML: string | undefined;
let emailWithErrorHTML: string | undefined;

export function setupConstants(context: vscode.ExtensionContext) {
  noEmailOpenHTML = readFileSync(
    context.asAbsolutePath("./assets/no email open.html"),
    { encoding: "utf-8" },
  );
  emailWithErrorHTML = readFileSync(
    context.asAbsolutePath("./assets/email with error.html"),
    { encoding: "utf-8" },
  );
  return getConstants();
}

export function getConstants() {
  if (!noEmailOpenHTML || !emailWithErrorHTML)
    throw new Error("the constants need to first be setup to then be used!", {
      cause: {
        noEmailOpenHTML,
        emailWithErrorHTML,
      },
    });
  return {
    noEmailOpenHTML,
    emailWithErrorHTML,
  };
}
