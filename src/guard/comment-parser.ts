import { COMMENT_TOKENS } from "../constants";
import { getCommentPrefixes } from "../languages/language-config";
import type { MaskedRange, ParseResult } from "../types";

/**
 * Returns true when the line contains the given token inside a comment.
 *
 * When `commentPrefixes` are provided the function checks that the token
 * appears *after* one of the recognised comment prefixes, preventing
 * false positives in string literals or code. When the list is empty
 * or omitted the check falls back to a simple `includes()`.
 */
function isTokenInComment(line: string, token: string, commentPrefixes: string[]): boolean {
    if (!line.includes(token)) {
        return false;
    }

    if (commentPrefixes.length === 0) {
        return true;
    }

    const tokenIndex = line.indexOf(token);
    const before = line.slice(0, tokenIndex);

    return commentPrefixes.some((prefix) => before.includes(prefix));
}

/**
 * Parses the lines of a document and returns the ranges that should be masked
 * based on `@stream-guard-*` comment annotations.
 *
 * Rules:
 *  - `// @stream-guard-next`   → redacts only the next line (the annotation stays visible)
 *  - `// @stream-guard-start` / `// @stream-guard-end` → redacts the content between them (markers stay visible)
 *  - `// @stream-guard-inline` at end of line → redacts that specific line
 *
 * An optional `languageId` (VSCode language identifier) can be supplied to
 * restrict token matching to lines that contain a recognised comment prefix
 * for that language.  When omitted the parser remains permissive and matches
 * any line that contains the token text.
 */
export function parseGuardComments(lines: string[], languageId?: string): ParseResult {
    const maskedRanges: MaskedRange[] = [];
    let guardNextFrom: number | undefined;
    let blockStart: number | undefined;

    const prefixes = languageId ? getCommentPrefixes(languageId) : [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (isTokenInComment(line, COMMENT_TOKENS.GUARD_START, prefixes)) {
            blockStart = i;
            continue;
        }

        if (isTokenInComment(line, COMMENT_TOKENS.GUARD_END, prefixes)) {
            if (blockStart !== undefined) {
                const contentStart = blockStart + 1;
                const contentEnd = i - 1;
                if (contentStart <= contentEnd) {
                    maskedRanges.push({ startLine: contentStart, endLine: contentEnd });
                }
                blockStart = undefined;
            }
            continue;
        }

        if (isTokenInComment(line, COMMENT_TOKENS.GUARD_NEXT, prefixes)) {
            guardNextFrom = i;
            continue;
        }

        if (isTokenInComment(line, COMMENT_TOKENS.GUARD_INLINE, prefixes)) {
            maskedRanges.push({ startLine: i, endLine: i });
            guardNextFrom = undefined;
            continue;
        }

        if (guardNextFrom !== undefined) {
            maskedRanges.push({ startLine: i, endLine: i });
            guardNextFrom = undefined;
        }
    }

    // If @stream-guard-next was the very last line, there is no content line to hide
    // so we simply discard the pending annotation.

    return { maskedRanges };
}
