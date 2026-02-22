import type * as vscode from "vscode";

/**
 * Resolved configuration for the StreamHider extension.
 */
export interface StreamHiderConfig {
    enabled: boolean;
    hiddenFilePatterns: string[];
    hiddenFolders: string[];
    replacement: string;
}

/**
 * Describes a range of lines in a document that should be hidden.
 */
export interface HiddenRange {
    startLine: number;
    /** Inclusive end line. */
    endLine: number;
}

/**
 * Result of parsing a single document for hide comments.
 */
export interface ParseResult {
    hiddenRanges: HiddenRange[];
}

/**
 * Context passed to the decoration provider when applying decorations.
 */
export interface DecorationContext {
    editor: vscode.TextEditor;
    hiddenRanges: HiddenRange[];
    replacement: string;
}
