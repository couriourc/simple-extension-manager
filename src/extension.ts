import { commands, ExtensionContext, Uri, } from 'vscode';
import { ExtensionManagerPanel } from './panels/ExtensionManagerPanel';
import { dirname } from 'path';
import { IS_DEVELOPMENT_MODE, State } from './utils';

export function activate(context: ExtensionContext) {
	let rootPath = "";
	if (IS_DEVELOPMENT_MODE) {
		rootPath = process.env.USERPROFILE + "\\.vscode\\extensions";
	} else {
		rootPath = dirname(context.extensionPath);
	}


	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.manage.ExtensionPack", async () => {
			State.rootPath = rootPath;
			State.context = context;
			if (IS_DEVELOPMENT_MODE) {
				ExtensionManagerPanel.render(context.extensionUri);
				console.log(context.extensionUri)
				// ExtensionManagerPanel.render(Uri.parse("http://localhost:5173/"));
			} else {
				ExtensionManagerPanel.render(context.extensionUri);
			}
		})
	);

	context.subscriptions.push(
		commands.registerCommand("simple-extension-manager.view.ExtensionPack", async () => {
			commands.executeCommand(
				"workbench.extensions.search",
				'@installed @category:"Custom Extension"'
			);
		})
	);
}




export function deactivate() { }
