import * as vscode from "vscode";
import { readConfig } from "../config/workspace-config";
import { logInfo, logWarn } from "../utils/logger";
import { parseHideComments } from "./comment-parser";
import { applyDecorations, clearDecorations } from "./decoration-provider";
import { matchesAnyPattern } from "./pattern-matcher";

/**
 * Refreshes decorations for all currently visible text editors.
 */
export function refreshAllEditors(): void {
    for (const editor of vscode.window.visibleTextEditors) {
        refreshEditor(editor);
    }
}

/**
 * Refreshes decorations for a single text editor.
 */
export function refreshEditor(editor: vscode.TextEditor): void {
    const config = readConfig();

    if (!config.enabled) {
        clearDecorations(editor);
        return;
    }

    const filePath = editor.document.uri.fsPath;

    const fileIsHidden = matchesAnyPattern(filePath, config.hiddenFilePatterns);
    const folderIsHidden = matchesAnyPattern(filePath, config.hiddenFolders);

    if (fileIsHidden || folderIsHidden) {
        // Hide the entire file content
        const lineCount = editor.document.lineCount;
        if (lineCount === 0) {
            clearDecorations(editor);
            return;
        }
        applyDecorations({
            editor,
            hiddenRanges: [{ startLine: 0, endLine: lineCount - 1 }],
            replacement: config.replacement,
        });
        logInfo(`Hidden entire file: ${filePath}`);
        return;
    }

    const lines: string[] = [];
    for (let i = 0; i < editor.document.lineCount; i++) {
        lines.push(editor.document.lineAt(i).text);
    }

    const { hiddenRanges } = parseHideComments(lines);

    if (hiddenRanges.length === 0) {
        clearDecorations(editor);
        return;
    }

    applyDecorations({ editor, hiddenRanges, replacement: config.replacement });
    logInfo(`Applied ${hiddenRanges.length} hidden range(s) to ${filePath}`);
}

/**
 * Toggles the `streamHider.enabled` setting in the workspace configuration.
 */
export async function toggleStreamMode(): Promise<void> {
    const config = readConfig();
    const newValue = !config.enabled;

    try {
        await vscode.workspace
            .getConfiguration()
            .update("streamHider.enabled", newValue, vscode.ConfigurationTarget.Workspace);
        logInfo(`Stream mode ${newValue ? "enabled" : "disabled"}.`);
    } catch (err) {
        logWarn(`Could not update workspace config: ${err instanceof Error ? err.message : String(err)}`);
        // Fall back to global setting
        await vscode.workspace
            .getConfiguration()
            .update("streamHider.enabled", newValue, vscode.ConfigurationTarget.Global);
    }
}
