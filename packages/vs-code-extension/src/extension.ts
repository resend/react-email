// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { readFileSync } from "fs";

import { renderOpenEmailFile } from "./renderOpenEmailFile";
import { convertAllEmailAssetSourcesIntoWebviewURIs } from "./convertAllEmailAssetSourcesIntoWebviewURIs";
import { basename } from "path";

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined = undefined;

  const noEmailOpenHTML = readFileSync(
    context.asAbsolutePath("./assets/no email open.html"),
    { encoding: "utf-8" },
  );
  const emailWithErrorHTML = readFileSync(
    context.asAbsolutePath("./assets/email with error.html"),
    { encoding: "utf-8" },
  );

  const updatePreviewPanelContent = async () => {
    if (previewPanel) {
      if (vscode.window.activeTextEditor) {
        try {
          let builtEmail = await renderOpenEmailFile(
            vscode.window.activeTextEditor,
          );
          if (builtEmail && builtEmail.valid) {
            previewPanel.title = `react-email preview - ${builtEmail.filename}`;
            previewPanel.webview.html =
              convertAllEmailAssetSourcesIntoWebviewURIs(
                builtEmail.html,
                vscode.Uri.joinPath(
                  vscode.window.activeTextEditor.document.uri,
                  "..",
                ), // the emails folder
                previewPanel,
              );
          }
          // keeps the current content if the email is invalid and did not error
          // this invalidness can happen if the focused content is a image,
          // does not a export a default and for some other similar situations
        } catch (exception) {
          previewPanel.title = `react-email preview - error on the email ${basename(
            vscode.window.activeTextEditor.document.fileName,
          )}`;
          let errorMessage: string;
          if (exception instanceof Error) {
            errorMessage = exception.stack ?? exception.message;
          } else {
            errorMessage = exception as string;
          }
          previewPanel.webview.html = emailWithErrorHTML.replace(
            "{ERROR MESSAGE}",
            errorMessage,
          );
        }
      } else if (previewPanel.webview.html.trim().length === 0) {
        previewPanel.title = `react-email preview - try opening an email!`;
        previewPanel.webview.html = noEmailOpenHTML;
      }
    }
  };

  let disposable = vscode.commands.registerCommand(
    "react-email-preview.open",
    () => {
      if (typeof previewPanel !== 'undefined') return;

      previewPanel = vscode.window.createWebviewPanel(
        "react-email preview - try opening an email",
        "react-email preview - try opening an email",
        vscode.ViewColumn.Two,
        { enableScripts: true },
      );

      previewPanel.onDidDispose(() => previewPanel = undefined);

      updatePreviewPanelContent();

      vscode.workspace.onDidChangeTextDocument((ev) => {
        if (
          ev.document.fileName ===
          vscode.window.activeTextEditor?.document.fileName
        ) {
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
