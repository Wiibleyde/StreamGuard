import * as vscode from "vscode";
import { CONFIG_KEYS, DEFAULT_REPLACEMENT } from "../constants";
import type { StreamHiderConfig } from "../types";

/**
 * Reads the StreamHider configuration from the current workspace settings.
 */
export function readConfig(): StreamHiderConfig {
    const cfg = vscode.workspace.getConfiguration();

    const enabled = cfg.get<boolean>(CONFIG_KEYS.ENABLED) ?? false;
    const hiddenFilePatterns = cfg.get<string[]>(CONFIG_KEYS.HIDDEN_FILE_PATTERNS) ?? [];
    const hiddenFolders = cfg.get<string[]>(CONFIG_KEYS.HIDDEN_FOLDERS) ?? [];
    const replacement = cfg.get<string>(CONFIG_KEYS.REPLACEMENT) ?? DEFAULT_REPLACEMENT;

    return { enabled, hiddenFilePatterns, hiddenFolders, replacement };
}
