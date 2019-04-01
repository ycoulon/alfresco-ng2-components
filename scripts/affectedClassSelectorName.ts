import { readFileSync, readdirSync, statSync } from "fs";
import * as ts from "typescript";

export function delint(sourceFile: ts.SourceFile, findFiles: string[]): String {
	let selectorName = ''
	delintNode(sourceFile);
	return selectorName;

	function delintNode(node: ts.Node) {
		switch (node.kind) {
			case ts.SyntaxKind.PropertyAssignment:
			let selectotProperty = <ts.PropertyAssignment>node;
			if (selectotProperty.name.getText() === 'selector') {
				selectorName = selectotProperty.initializer.getText();
			}
			break;
		}
		ts.forEachChild(node, delintNode);

	}
}

const params = process.argv.slice(2);
const file = params[0];

// Parse a file
let sourceFile = ts.createSourceFile(
    file,
    readFileSync(`${file}`).toString(),
    ts.ScriptTarget.ES2015,
            /*setParentNodes */ true
);

// delint it
const selectorName = delint(sourceFile, undefined);

console.log(selectorName);

