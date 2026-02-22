import * as vscode from "vscode";
import { OUTPUT_CHANNEL_NAME } from "../constants";

let channel: vscode.OutputChannel | undefined;

function getChannel(): vscode.OutputChannel {
    if (!channel) {
        channel = vscode.window.createOutputChannel(OUTPUT_CHANNEL_NAME);
    }
    return channel;
}

export function logInfo(message: string): void {
    getChannel().appendLine(`[INFO]  ${message}`);
}

export function logWarn(message: string): void {
    getChannel().appendLine(`[WARN]  ${message}`);
}

export function logError(message: string, error?: unknown): void {
    const detail = error instanceof Error ? ` — ${error.message}` : error !== undefined ? ` — ${String(error)}` : "";
    getChannel().appendLine(`[ERROR] ${message}${detail}`);
}

export function disposeLogger(): void {
    channel?.dispose();
    channel = undefined;
}
