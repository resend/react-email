// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readFileSync } from "fs";

import { renderOpenEmailFile } from "./renderOpenEmailFile";
import { convertAllEmailAssetSourcesIntoWebviewURIs } from "./convertAllEmailAssetSourcesIntoWebviewURIs";

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined = undefined;

  const noEmailOpenHTML = readFileSync(context.asAbsolutePath('./assets/no email open.html'), { encoding: 'utf-8' });

  const updatePreviewPanelContent = async () => {
    if (previewPanel) {
      if (vscode.window.activeTextEditor) {
        let builtEmail = await renderOpenEmailFile(
          vscode.window.activeTextEditor,
        );
        previewPanel.title = `react-email preview - ${builtEmail.filename}`;
        previewPanel.webview.html =
          convertAllEmailAssetSourcesIntoWebviewURIs(
            builtEmail.html,
            vscode.Uri.joinPath(vscode.window.activeTextEditor.document.uri, '..'), // the emails folder
            previewPanel,
          );
      } else if (previewPanel.webview.html.trim().length === 0) {
        previewPanel.title = `react-email preview - try opening an email!`;
        previewPanel.webview.html = noEmailOpenHTML;
      }
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

      updatePreviewPanelContent();

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
