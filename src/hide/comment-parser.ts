import { COMMENT_TOKENS } from "../constants";
import type { HiddenRange, ParseResult } from "../types";

/**
 * Returns true when the trimmed line contains the given token.
 */
function lineContains(line: string, token: string): boolean {
    return line.includes(token);
}

/**
 * Parses the lines of a document and returns the ranges that should be hidden
 * based on `@stream-hide-*` comment annotations.
 *
 * Rules:
 *  - `// @stream-hide-next`   → hides the *next* non-hide-comment line
 *  - `// @stream-hide-start` / `// @stream-hide-end` → hides the block between them (inclusive)
 *  - `// @stream-hide-inline` at end of line → hides that specific line
 */
export function parseHideComments(lines: string[]): ParseResult {
    const hiddenRanges: HiddenRange[] = [];
    let hideNext = false;
    let blockStart: number | undefined;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (lineContains(line, COMMENT_TOKENS.HIDE_START)) {
            blockStart = i;
            continue;
        }

        if (lineContains(line, COMMENT_TOKENS.HIDE_END)) {
            if (blockStart !== undefined) {
                hiddenRanges.push({ startLine: blockStart, endLine: i });
                blockStart = undefined;
            }
            continue;
        }

        if (lineContains(line, COMMENT_TOKENS.HIDE_NEXT)) {
            hideNext = true;
            continue;
        }

        if (lineContains(line, COMMENT_TOKENS.HIDE_INLINE)) {
            hiddenRanges.push({ startLine: i, endLine: i });
            hideNext = false;
            continue;
        }

        if (hideNext) {
            hiddenRanges.push({ startLine: i, endLine: i });
            hideNext = false;
        }
    }

    return { hiddenRanges };
}
