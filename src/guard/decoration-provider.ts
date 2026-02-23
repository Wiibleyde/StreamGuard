import * as vscode from "vscode";
import type { DecorationContext } from "../types";

/** Single decoration type used for all guarded ranges (overlay style). */
let maskedDecorationType: vscode.TextEditorDecorationType | undefined;

/** The color currently baked into the cached decoration type. */
let currentColor = "";

/**
 * Resolves the color to use for decorations.
 * If the user supplied a custom hex color it is returned as-is;
 * otherwise falls back to the `editorWarning.foreground` theme color.
 */
function resolveColor(customColor: string): string | vscode.ThemeColor {
    if (customColor.length > 0) {
        return customColor;
    }
    return new vscode.ThemeColor("editorWarning.foreground");
}

function createDecorationType(customColor: string): vscode.TextEditorDecorationType {
    const color = resolveColor(customColor);

    return vscode.window.createTextEditorDecorationType({
        backgroundColor: color,
        color: color,
        isWholeLine: true,
        overviewRulerColor: color,
        overviewRulerLane: vscode.OverviewRulerLane.Full,
        before: {
            contentText: "\u00A0\u00A0\u26A0\uFE0F\u00A0Stream\u00A0Guard\u00A0Active\u00A0\u00A0",
            color: new vscode.ThemeColor("editor.background"),
            backgroundColor: color,
            fontWeight: "bold",
            margin: "0 4px 0 0",
        },
    });
}

function getDecorationType(customColor: string): vscode.TextEditorDecorationType {
    if (maskedDecorationType && currentColor === customColor) {
        return maskedDecorationType;
    }

    // Color changed or first call — (re)create the decoration type
    if (maskedDecorationType) {
        maskedDecorationType.dispose();
    }

    maskedDecorationType = createDecorationType(customColor);
    currentColor = customColor;
    return maskedDecorationType;
}

/**
 * Eagerly creates the decoration type so it is ready before any editor opens.
 * Call once during extension activation.
 */
export function initDecorations(customColor = ""): void {
    getDecorationType(customColor);
}

/**
 * Applies redaction decorations to the given editor for all masked ranges.
 */
export function applyDecorations(ctx: DecorationContext): void {
    const { editor, maskedRanges, decorationColor } = ctx;
    const decorationType = getDecorationType(decorationColor ?? "");

    const ranges = maskedRanges.map(({ startLine, endLine }) => {
        const start = editor.document.lineAt(startLine).range.start;
        const end = editor.document.lineAt(endLine).range.end;
        return new vscode.Range(start, end);
    });

    editor.setDecorations(decorationType, ranges);
}

/**
 * Clears all StreamGuard decorations from the given editor.
 */
export function clearDecorations(editor: vscode.TextEditor): void {
    if (maskedDecorationType) {
        editor.setDecorations(maskedDecorationType, []);
    }
}

/**
 * Disposes all cached decoration types (call on extension deactivation).
 */
export function disposeDecorations(): void {
    if (maskedDecorationType) {
        maskedDecorationType.dispose();
        maskedDecorationType = undefined;
    }
}
