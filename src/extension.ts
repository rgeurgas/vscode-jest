import * as vscode from "vscode";
import { JestRunnerCodeLensProvider } from "./JestCodeLensProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log("runner-jest-vscode running.");
  const jestOutput = vscode.window.createOutputChannel("Jest");

  const codeLensProvider = new JestRunnerCodeLensProvider(jestOutput);

  const jestRun = vscode.commands.registerCommand(
    "runner-jest-vscode.jestRun",
    async (argument: string) => {
      console.log(`Running test ${argument}`);

      vscode.window.showInformationMessage(`Running test ${argument}`);
    }
  );

  const selector: vscode.DocumentFilter = {
    scheme: "file",
    pattern: "**/*.{test,spec}.{js,jsx,ts,tsx}",
  };
  const codeLensProviderDisposable = vscode.languages.registerCodeLensProvider(
    selector,
    codeLensProvider
  );
  context.subscriptions.push(codeLensProviderDisposable);

  context.subscriptions.push(jestRun);
}

// this method is called when your extension is deactivated
export function deactivate() {}
