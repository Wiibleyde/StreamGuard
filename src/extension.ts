import * as vscode from "vscode";
import { watchConfig } from "./config/config-watcher";
import { readConfig } from "./config/workspace-config";
import { COMMANDS } from "./constants";
import { disposeDecorations } from "./hide/decoration-provider";
import { refreshAllEditors, refreshEditor, toggleStreamMode } from "./hide/hide-manager";
import { disposeLogger, logInfo } from "./utils/logger";

let statusBarItem: vscode.StatusBarItem | undefined;

function updateStatusBar(): void {
    if (!statusBarItem) {
        return;
    }

    const { enabled } = readConfig();
    statusBarItem.text = enabled ? "$(eye-closed) Stream Mode ON" : "$(eye) Stream Mode OFF";
    statusBarItem.tooltip = "Click to toggle StreamHider";
    statusBarItem.backgroundColor = enabled ? new vscode.ThemeColor("statusBarItem.warningBackground") : undefined;
}

export function activate(context: vscode.ExtensionContext): void {
    logInfo("StreamHider activating.");

    // Status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = COMMANDS.TOGGLE;
    updateStatusBar();
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    // Toggle command
    context.subscriptions.push(
        vscode.commands.registerCommand(COMMANDS.TOGGLE, async () => {
            await toggleStreamMode();
            updateStatusBar();
            refreshAllEditors();
        }),
    );

    // React to config changes
    context.subscriptions.push(
        watchConfig(() => {
            updateStatusBar();
            refreshAllEditors();
        }),
    );

    // React to document changes (real-time)
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event) => {
            const editor = vscode.window.visibleTextEditors.find((e) => e.document === event.document);
            if (editor) {
                refreshEditor(editor);
            }
        }),
    );

    // React to newly visible editors
    context.subscriptions.push(
        vscode.window.onDidChangeVisibleTextEditors((editors) => {
            for (const editor of editors) {
                refreshEditor(editor);
            }
        }),
    );

    // Initial decoration pass
    refreshAllEditors();

    logInfo("StreamHider activated.");
}

export function deactivate(): void {
    disposeDecorations();
    disposeLogger();
}
