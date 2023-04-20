const vscode = require('vscode');

const BLACKLISTED_WORDS = ["aman", "sakhuja"];
const API_TOKEN = "105a85ce-e5cb-4592-ab4d-07b6c212ce46";
let config = vscode.workspace.getConfiguration('my-extension');
let statusBarItem = vscode.window.createStatusBarItem();

function checkForBlacklistedWords(document) {
    if (config.get('token') !== API_TOKEN) {
		vscode.window.showWarningMessage("Please provide a valid Api Token.");
		return;
	}
	let text = document.getText();
	for (var i=0; i<BLACKLISTED_WORDS.length; i++) {
		if (text.includes(BLACKLISTED_WORDS[i])) {
			let remove = config.get("removeWord");
			if (remove) {
				let updatedText = text.replace(/aman|sakhuja/gi, '');
				let edit = new vscode.WorkspaceEdit();
				edit.replace(document.uri, new vscode.Range(0, 0, document.lineCount, 0), updatedText);
				vscode.workspace.applyEdit(edit);
			}
			vscode.window.showWarningMessage(`Blacklisted word ${BLACKLISTED_WORDS[i]} detected${remove ? " and removed." : "."}`);
		}
	}
}

function createMyStatusBar() {
	statusBarItem.command = "myextension.openSettings";
    statusBarItem.text = 'MyExtension';
    statusBarItem.show();
}

function activate(context) {
	createMyStatusBar();
	context.subscriptions.push(vscode.workspace.onDidSaveTextDocument(event => {
		checkForBlacklistedWords(event);
	}));
	context.subscriptions.push(vscode.commands.registerCommand('myextension.openSettings', () => {
		vscode.commands.executeCommand('workbench.action.openSettings', 'myextension');
	}));
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
