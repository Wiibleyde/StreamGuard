import * as assert from "node:assert";
import { matchesAnyPattern, matchesFolderPattern } from "../hide/pattern-matcher";

describe("pattern-matcher", () => {
    describe("matchesAnyPattern", () => {
        it("returns false when patterns array is empty", () => {
            assert.strictEqual(matchesAnyPattern("src/index.ts", []), false);
        });

        it("matches an exact file name (basename matching)", () => {
            assert.strictEqual(matchesAnyPattern("src/.env", [".env"]), true);
        });

        it("matches a wildcard extension pattern against the basename", () => {
            assert.strictEqual(matchesAnyPattern("src/secrets.env", ["*.env"]), true);
        });

        it("does not match a different extension", () => {
            assert.strictEqual(matchesAnyPattern("src/index.ts", ["*.env"]), false);
        });

        it("matches a globstar pattern against a full path", () => {
            assert.strictEqual(matchesAnyPattern("config/secrets/api.json", ["config/secrets/**"]), true);
        });

        it("matches a nested path with **", () => {
            assert.strictEqual(matchesAnyPattern("a/b/c/secret.ts", ["**/*.ts"]), true);
        });

        it("does not match when the path differs", () => {
            assert.strictEqual(matchesAnyPattern("src/utils/logger.ts", ["config/**"]), false);
        });

        it("returns true when at least one of multiple patterns matches", () => {
            assert.strictEqual(matchesAnyPattern("src/.env", ["*.ts", ".env", "*.json"]), true);
        });

        it("handles Windows-style backslash paths by normalising to forward slashes", () => {
            assert.strictEqual(matchesAnyPattern("src\\secrets\\key.txt", ["src/secrets/**"]), true);
        });
    });

    describe("matchesFolderPattern", () => {
        it("matches a folder name directly", () => {
            assert.strictEqual(matchesFolderPattern("secrets", ["secrets"]), true);
        });

        it("matches a folder path with a globstar", () => {
            assert.strictEqual(matchesFolderPattern("src/private/data", ["src/private/**"]), true);
        });

        it("returns false when no patterns match", () => {
            assert.strictEqual(matchesFolderPattern("src/utils", ["secrets", "private"]), false);
        });
    });
});
