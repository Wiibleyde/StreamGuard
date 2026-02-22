import * as assert from "node:assert";
import { parseHideComments } from "../hide/comment-parser";

describe("comment-parser", () => {
    describe("@stream-hide-next", () => {
        it("hides the line immediately following the annotation", () => {
            const lines = ["// @stream-hide-next", "const secret = 'hunter2';", "const visible = true;"];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 1);
            assert.deepStrictEqual(hiddenRanges[0], { startLine: 1, endLine: 1 });
        });

        it("does not hide lines beyond the next line", () => {
            const lines = ["// @stream-hide-next", "const secret = 'hunter2';", "const alsoVisible = true;"];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 1);
            assert.strictEqual(hiddenRanges[0].endLine, 1);
        });

        it("handles annotation at the very last line (no following line)", () => {
            const lines = ["// @stream-hide-next"];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 0);
        });
    });

    describe("@stream-hide-start / @stream-hide-end", () => {
        it("hides the entire block between start and end (inclusive)", () => {
            const lines = [
                "const a = 1;",
                "// @stream-hide-start",
                "const password = 'secret';",
                "const token = 'abc123';",
                "// @stream-hide-end",
                "const b = 2;",
            ];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 1);
            assert.deepStrictEqual(hiddenRanges[0], { startLine: 1, endLine: 4 });
        });

        it("supports multiple blocks in the same file", () => {
            const lines = [
                "// @stream-hide-start",
                "const a = 1;",
                "// @stream-hide-end",
                "const visible = true;",
                "// @stream-hide-start",
                "const b = 2;",
                "// @stream-hide-end",
            ];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 2);
            assert.deepStrictEqual(hiddenRanges[0], { startLine: 0, endLine: 2 });
            assert.deepStrictEqual(hiddenRanges[1], { startLine: 4, endLine: 6 });
        });

        it("ignores a start without a matching end", () => {
            const lines = ["// @stream-hide-start", "const orphan = true;"];
            const { hiddenRanges } = parseHideComments(lines);
            // No end token → no completed range
            assert.strictEqual(hiddenRanges.length, 0);
        });
    });

    describe("@stream-hide-inline", () => {
        it("hides only the line containing the inline annotation", () => {
            const lines = [
                "const visible = true;",
                "const secret = 'password'; // @stream-hide-inline",
                "const alsoVisible = true;",
            ];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 1);
            assert.deepStrictEqual(hiddenRanges[0], { startLine: 1, endLine: 1 });
        });

        it("handles multiple inline annotations on separate lines", () => {
            const lines = [
                "const a = 1; // @stream-hide-inline",
                "const b = 2;",
                "const c = 3; // @stream-hide-inline",
            ];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 2);
            assert.deepStrictEqual(hiddenRanges[0], { startLine: 0, endLine: 0 });
            assert.deepStrictEqual(hiddenRanges[1], { startLine: 2, endLine: 2 });
        });
    });

    describe("empty and plain input", () => {
        it("returns no ranges for an empty file", () => {
            const { hiddenRanges } = parseHideComments([]);
            assert.strictEqual(hiddenRanges.length, 0);
        });

        it("returns no ranges when there are no annotations", () => {
            const lines = ["const a = 1;", "const b = 2;"];
            const { hiddenRanges } = parseHideComments(lines);
            assert.strictEqual(hiddenRanges.length, 0);
        });
    });
});
