import { readFileSync, readdirSync, statSync } from "fs";
import * as ts from "typescript";

export function delint(sourceFile: ts.SourceFile, findFiles: string[]): String[] {
	let affectedFiles = [];
	delintNode(sourceFile);
	return affectedFiles;

	function delintNode(node: ts.Node) {
		switch (node.kind) {
			case ts.SyntaxKind.ImportSpecifier:
				let importSpecifier = <ts.ImportSpecifier>node;
				const fileName = importSpecifier.name.escapedText;
				const found = findFiles.some((file) => file === fileName);
				if (found) {
					// console.log(`Yeppa ${fileName} found. Run this e2e ${node.getSourceFile().fileName}`);
					affectedFiles.push(node.getSourceFile().fileName);
				}
				break;
		}
		ts.forEachChild(node, delintNode);
	}
}

const walkSync = function (dir, filelist, fileType) {
	var files = readdirSync(dir);
	files.forEach(function (file) {
		// console.log(file)
		if (statSync(dir + file).isDirectory()) {
			filelist = walkSync(dir + file + '/', filelist, fileType);
		}
		else if (file.endsWith(`.${fileType}.html`)) {
			filelist.add(dir + file);
		}
	});
	//console.log(globalAffectedFiles.toString());
	return filelist;
};

const params = process.argv.slice(2);
const lookinFor = params[2].split(',');
const folder = params[1];
const type = params[0];

const items = new Set();
walkSync(folder, items, type);
// console.log("List of files to being analize");
// console.log([...items]);
// console.log("End");

let globalAffectedFiles = [];
items.forEach(function (file) {
	// console.log('Analyze: ' + file);
	// Parse a file
	let sourceFile = ts.createSourceFile(
		file,
		readFileSync(`${file}`).toString(),
		ts.ScriptTarget.ES2015,
				/*setParentNodes */ true
	);

	// delint it
	let affectedFiles = delint(sourceFile, lookinFor);
	globalAffectedFiles.push(...new Set(affectedFiles));
});

// console.log("List of Component that contains the "+ lookinFor);

console.log(globalAffectedFiles.toString());

