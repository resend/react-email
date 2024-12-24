// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { updatePreiewPanel } from "./update-preview-panel";
import { setupConstants } from "./constants";

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined;

  const { noEmailOpenHTML } = setupConstants(context);

  const disposable = vscode.commands.registerCommand(
    "react-email-preview.open",
    () => {
      if (typeof previewPanel !== "undefined") {
        return;
      }

      previewPanel = vscode.window.createWebviewPanel(
        "React Email — try opening an email",
        "React Email — try opening an email",
        vscode.ViewColumn.Two,
        { enableScripts: true },
      );
      previewPanel.webview.html = noEmailOpenHTML;

      previewPanel.onDidDispose(() => (previewPanel = undefined));

      vscode.workspace.onDidSaveTextDocument((ev) => {
        if (ev.fileName === vscode.window.activeTextEditor?.document.fileName) {
          void updatePreiewPanel(previewPanel);
        }
      });

      vscode.window.onDidChangeActiveTextEditor(() => {
        void updatePreiewPanel(previewPanel);
      });
    },
  );

  context.subscriptions.push(disposable);
}
