/**
 * Command identifiers registered by the StreamHider extension.
 */
export const COMMANDS = {
    TOGGLE: "streamHider.toggle",
} as const;

/**
 * Configuration keys used in .vscode/settings.json under the "streamHider" namespace.
 */
export const CONFIG_KEYS = {
    ENABLED: "streamHider.enabled",
    HIDDEN_FILE_PATTERNS: "streamHider.hiddenFilePatterns",
    HIDDEN_FOLDERS: "streamHider.hiddenFolders",
    REPLACEMENT: "streamHider.replacement",
} as const;

/**
 * Default placeholder text shown instead of hidden content.
 */
export const DEFAULT_REPLACEMENT = "[ 🔴 HIDDEN ]";

/**
 * Comment tokens used to trigger inline hiding behaviour.
 */
export const COMMENT_TOKENS = {
    HIDE_NEXT: "@stream-hide-next",
    HIDE_START: "@stream-hide-start",
    HIDE_END: "@stream-hide-end",
    HIDE_INLINE: "@stream-hide-inline",
} as const;

/**
 * Name of the VSCode OutputChannel used for extension logging.
 */
export const OUTPUT_CHANNEL_NAME = "StreamHider";
