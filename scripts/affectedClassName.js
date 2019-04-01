"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var ts = require("typescript");
function delint(sourceFile, findFiles) {
    var classFoundName = '';
    delintNode(sourceFile);
    return classFoundName;
    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.ClassDeclaration:
                var classSpecifier = node;
                classFoundName = classSpecifier.name.escapedText.toString();
                break;
        }
        ts.forEachChild(node, delintNode);
    }
}
exports.delint = delint;
var params = process.argv.slice(2);
var file = params[0];
// Parse a file
var sourceFile = ts.createSourceFile(file, fs_1.readFileSync("" + file).toString(), ts.ScriptTarget.ES2015, 
/*setParentNodes */ true);
// delint it
var className = delint(sourceFile, undefined);
console.log(className);
