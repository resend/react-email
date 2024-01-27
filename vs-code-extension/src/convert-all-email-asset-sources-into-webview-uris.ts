import * as vscode from "vscode";

/**
 * @description Replaces all occurrences of src="/static/..." with a
 * uri vscode will allow using because of their restrictness about accessing
 * local files.
 *
 * @param originalHTML The HTML generated for the webview that will be used to find the src="/static/..."
 * occurrences.
 * @param emailsDirVSCodeURI The path to the emails folder that the email is contained in
 * @param previewPanel The panel that the extensions is running the preview on
 *
 * @returns A new version of the HTML with the proper static paths so the user can see them
 */
export function convertAllEmailAssetSourcesIntoWebviewURIs(
  originalHTML: string,
  emailsDirVSCodeURI: vscode.Uri,
  previewPanel: vscode.WebviewPanel,
): string {
  return originalHTML.replace(
    /src\s*=\s*"(\/static\/[^"]*)"/,
    (_srcProperty, /* the first capturing group */ uri) => {
      const newSource = previewPanel.webview.asWebviewUri(
        vscode.Uri.joinPath(emailsDirVSCodeURI, uri),
      );

      return `src="${newSource}"`;
    },
  );
}
