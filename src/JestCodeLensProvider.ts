import { parse, ParsedNode } from "jest-editor-support";
import {
  CodeLens,
  CodeLensProvider,
  Range,
  TextDocument,
  OutputChannel,
} from "vscode";

function getTestsBlocks(
  parsedNode: ParsedNode,
  parseResults: ParsedNode[]
): CodeLens[] {
  const codeLens: CodeLens[] = [];

  parsedNode.children?.forEach((subNode) => {
    codeLens.push(...getTestsBlocks(subNode, parseResults));
  });

  const range = new Range(
    parsedNode.start.line - 1,
    parsedNode.start.column,
    parsedNode.end.line - 1,
    parsedNode.end.column
  );

  if (parsedNode.type === "expect") {
    return [];
  }

  // const fullTestName = escapeRegExp(findFullTestName(parsedNode.start.line, parseResults));
  const fullTestName = "hello";

  codeLens.push(
    new CodeLens(range, {
      arguments: [fullTestName],
      command: "extension.runJest",
      title: "Run",
    }),
    new CodeLens(range, {
      arguments: [fullTestName],
      command: "extension.debugJest",
      title: "Debug",
    })
  );

  return codeLens;
}

export class JestRunnerCodeLensProvider implements CodeLensProvider {
  private jestOutput: OutputChannel;

  constructor(jestOutput: OutputChannel) {
    this.jestOutput = jestOutput;
  }

  public async provideCodeLenses(document: TextDocument): Promise<CodeLens[]> {
    const parseResults = parse(document.fileName, document.getText()).root
      .children;

    this.jestOutput.appendLine(parseResults?.toString() ?? "No parseResults");

    const codeLens = [] as Array<CodeLens>;
    parseResults?.forEach((parseResult) =>
      codeLens.push(...getTestsBlocks(parseResult, parseResults))
    );

    return codeLens;
  }
}
