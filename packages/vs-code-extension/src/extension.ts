// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

import { basename, dirname, join, normalize } from "path";
import * as esbuild from "esbuild";

import { render } from "@react-email/render";
import { unlink } from "fs/promises";

interface BuiltEmail {
  filename: string;
  html: string;
  text: string;
}

async function getHTMLAndTextForEmailOfEditor<
  ActiveEditor extends vscode.TextEditor | undefined,
>(
  activeEditor: ActiveEditor,
): Promise<ActiveEditor extends undefined ? undefined : BuiltEmail> {
  if (activeEditor) {
    const currentlyOpenTabfilePath = activeEditor.document.fileName; // actually a path not the name of the file
    const emailsDirectory = join(currentlyOpenTabfilePath, "..");

    const previewDirectory = join(emailsDirectory, ".preview");
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
      pretty: true,
    });
    const emailAsHTML = render(comp, { pretty: true });
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

function convertAllEmailAssetSourcesIntoWebviewURIs(
  html: string,
  dirnameOfEmail: vscode.Uri,
  panel: vscode.WebviewPanel,
): string {
  return html.replace(
    /src\s*=\s*"(\/static\/[^"]*)"/,
    (srcProperty, /* the first capturing group */ uri) => {
      const newSource = panel.webview.asWebviewUri(
        vscode.Uri.joinPath(dirnameOfEmail, uri),
      );

      return `src="${newSource}"`;
    },
  );
}

export function activate(context: vscode.ExtensionContext) {
  let previewPanel: vscode.WebviewPanel | undefined = undefined;

  let disposable = vscode.commands.registerCommand(
    "react-email-preview.preview",
    () => {
      previewPanel = vscode.window.createWebviewPanel(
        "react-email preview",
        "react-email preview",
        vscode.ViewColumn.Two,
        { enableScripts: true },
      );

      const updatePreview = async () => {
        if (vscode.window.activeTextEditor && previewPanel) {
          let builtEmail = await getHTMLAndTextForEmailOfEditor(
            vscode.window.activeTextEditor,
          );
          previewPanel.title = `react-email preview for ${builtEmail.filename}`;
          previewPanel.webview.html =
            convertAllEmailAssetSourcesIntoWebviewURIs(
              builtEmail.html, // temporarily
              vscode.Uri.joinPath(vscode.window.activeTextEditor.document.uri, '..'),
              previewPanel,
            );
        }
      };

      vscode.workspace.onDidSaveTextDocument((ev) => {
        if (ev.fileName === vscode.window.activeTextEditor?.document.fileName) {
          updatePreview();
        }
      });

      vscode.window.onDidChangeActiveTextEditor(() => {
        updatePreview();
      });
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
