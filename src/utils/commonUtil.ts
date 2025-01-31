import { window } from "vscode";
import { ExtensionContext } from 'vscode';

export function showErrMsg(msg: string) {
    window.showErrorMessage(msg);
    console.error(msg);
}

export function showInfoMsg(msg: string) {
    window.showInformationMessage(msg);
    console.error(msg);
}

export async function showWaringMsg(msg: string, ...selects: string[]) {
    return await window.showWarningMessage(msg, ...selects);
}

export let IS_DEVELOPMENT_MODE = true;
/**
 * 通用数据，以及导出上下文
 */
export class State {
    public static rootPath: string;

    public static context: ExtensionContext;
}


