// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { renderOpenEmailFile } from "./renderOpenEmailFile";
import { convertAllEmailAssetSourcesIntoWebviewURIs } from "./convertAllEmailAssetSourcesIntoWebviewURIs";

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined = undefined;

  const updatePreviewPanelContent = async () => {
    if (vscode.window.activeTextEditor && previewPanel) {
      let builtEmail = await renderOpenEmailFile(
        vscode.window.activeTextEditor,
      );
      previewPanel.title = `react-email preview for ${builtEmail.filename}`;
      previewPanel.webview.html =
        convertAllEmailAssetSourcesIntoWebviewURIs(
          builtEmail.html,
          vscode.Uri.joinPath(vscode.window.activeTextEditor.document.uri, '..'), // the emails folder
          previewPanel,
        );
    }
  };

  let disposable = vscode.commands.registerCommand(
    "react-email-preview.preview",
    () => {
      previewPanel = vscode.window.createWebviewPanel(
        "react-email preview",
        "react-email preview",
        vscode.ViewColumn.Two,
        { enableScripts: true },
      );

      vscode.workspace.onDidSaveTextDocument((ev) => {
        if (ev.fileName === vscode.window.activeTextEditor?.document.fileName) {
          updatePreviewPanelContent();
        }
      });

      vscode.window.onDidChangeActiveTextEditor(() => {
        updatePreviewPanelContent();
      });
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
