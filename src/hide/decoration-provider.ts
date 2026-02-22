import * as vscode from "vscode";
import type { DecorationContext } from "../types";

/** Keyed by replacement text so we can reuse the same decoration type. */
const decorationTypes = new Map<string, vscode.TextEditorDecorationType>();

function getDecorationType(replacement: string): vscode.TextEditorDecorationType {
    const existing = decorationTypes.get(replacement);
    if (existing) {
        return existing;
    }

    const decorationType = vscode.window.createTextEditorDecorationType({
        before: {
            contentText: replacement,
            color: new vscode.ThemeColor("editorWarning.foreground"),
            fontStyle: "italic",
        },
        color: "transparent",
        letterSpacing: "-1000em",
    });

    decorationTypes.set(replacement, decorationType);
    return decorationType;
}

/**
 * Applies hiding decorations to the given editor for all hidden ranges.
 */
export function applyDecorations(ctx: DecorationContext): void {
    const { editor, hiddenRanges, replacement } = ctx;
    const decorationType = getDecorationType(replacement);

    const ranges = hiddenRanges.map(({ startLine, endLine }) => {
        const start = editor.document.lineAt(startLine).range.start;
        const end = editor.document.lineAt(endLine).range.end;
        return new vscode.Range(start, end);
    });

    editor.setDecorations(decorationType, ranges);
}

/**
 * Clears all StreamHider decorations from the given editor.
 */
export function clearDecorations(editor: vscode.TextEditor): void {
    for (const decorationType of decorationTypes.values()) {
        editor.setDecorations(decorationType, []);
    }
}

/**
 * Disposes all cached decoration types (call on extension deactivation).
 */
export function disposeDecorations(): void {
    for (const decorationType of decorationTypes.values()) {
        decorationType.dispose();
    }
    decorationTypes.clear();
}
