// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readFileSync } from "fs";

import { updatePreiewPanel } from "./update-preview-panel";

export let noEmailOpenHTML: string;
export let emailWithErrorHTML: string;

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined = undefined;

  // loads in the default htmls
  noEmailOpenHTML = readFileSync(
    context.asAbsolutePath("./assets/no email open.html"),
    { encoding: "utf-8" },
  );
  emailWithErrorHTML = readFileSync(
    context.asAbsolutePath("./assets/email with error.html"),
    { encoding: "utf-8" },
  );

  let disposable = vscode.commands.registerCommand(
    "react-email-preview.open",
    () => {
      if (typeof previewPanel !== "undefined") {
        return;
      }

      previewPanel = vscode.window.createWebviewPanel(
        "react-email preview - try opening an email",
        "react-email preview - try opening an email",
        vscode.ViewColumn.Two,
        { enableScripts: true },
      );
      previewPanel.webview.html = noEmailOpenHTML;

      previewPanel.onDidDispose(() => (previewPanel = undefined));

      vscode.workspace.onDidSaveTextDocument((ev) => {
        if (ev.fileName === vscode.window.activeTextEditor?.document.fileName) {
          updatePreiewPanel(previewPanel);
        }
      });

      vscode.window.onDidChangeActiveTextEditor(() => {
        updatePreiewPanel(previewPanel);
      });
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
