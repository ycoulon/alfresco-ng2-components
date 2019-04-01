"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var ts = require("typescript");
function delint(sourceFile, findFiles) {
    var selectorName = '';
    delintNode(sourceFile);
    return selectorName;
    function delintNode(node) {
        switch (node.kind) {
            case ts.SyntaxKind.PropertyAssignment:
                var selectotProperty = node;
                if (selectotProperty.name.getText() === 'selector') {
                    selectorName = selectotProperty.initializer.getText();
                }
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
var selectorName = delint(sourceFile, undefined);
console.log(selectorName);
