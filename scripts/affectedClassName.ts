import { readFileSync } from "fs";
import * as ts from "typescript";

export function delint(sourceFile: ts.SourceFile, findFiles: string[]): String {
	let classFoundName = ''
	delintNode(sourceFile);
	return classFoundName;

	function delintNode(node: ts.Node) {
		switch (node.kind) {
			case ts.SyntaxKind.ClassDeclaration:
			let classSpecifier = <ts.ClassDeclaration>node;
			classFoundName = classSpecifier.name.escapedText.toString();
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
const className = delint(sourceFile, undefined);

console.log(className);

