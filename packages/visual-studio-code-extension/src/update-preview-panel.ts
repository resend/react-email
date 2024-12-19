import * as vscode from "vscode";

import { basename } from "path";

import { renderOpenEmailFile } from "./render-open-email-file";
import { convertAllEmailAssetSourcesIntoWebviewURIs } from "./convert-all-email-asset-sources-into-webview-uris";

import { emailWithErrorHTML, noEmailOpenHTML } from "./extension";

export async function updatePreiewPanel(
  previewPanel: vscode.WebviewPanel | undefined,
) {
  if (previewPanel) {
    if (vscode.window.activeTextEditor) {
      try {
        let builtEmail = await renderOpenEmailFile(
          vscode.window.activeTextEditor,
        );
        if (
          builtEmail &&
          builtEmail.valid &&
          builtEmail.html &&
          builtEmail.html.trim().length > 0
        ) {
          previewPanel.title = `React Email — ${builtEmail.filename}`;
          console.log(
            builtEmail.html
          );
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
        previewPanel.title = `React Email — error on the email ${basename(
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
      previewPanel.title = `React Email — try opening an email!`;
      previewPanel.webview.html = noEmailOpenHTML;
    }
  }
}
