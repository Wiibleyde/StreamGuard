import * as assert from "node:assert";
import {
    applyCustomPrefixes,
    getAllLanguageConfigs,
    getCommentPrefixes,
    getLanguageConfig,
    getSupportedLanguageIds,
    registerLanguageConfig,
} from "../languages/language-config";

describe("language-config", () => {
    describe("getLanguageConfig", () => {
        it("returns config for a built-in language (typescript)", () => {
            const config = getLanguageConfig("typescript");
            assert.ok(config);
            assert.strictEqual(config.id, "typescript");
            assert.strictEqual(config.displayName, "TypeScript");
            assert.deepStrictEqual(config.singleLine, ["//"]);
            assert.deepStrictEqual(config.block, { start: "/*", end: "*/" });
        });

        it("returns config for lua", () => {
            const config = getLanguageConfig("lua");
            assert.ok(config);
            assert.strictEqual(config.id, "lua");
            assert.strictEqual(config.displayName, "Lua");
            assert.deepStrictEqual(config.singleLine, ["--"]);
            assert.deepStrictEqual(config.block, { start: "--[[", end: "]]" });
        });

        it("returns config for python", () => {
            const config = getLanguageConfig("python");
            assert.ok(config);
            assert.deepStrictEqual(config.singleLine, ["#"]);
        });

        it("returns undefined for an unknown language", () => {
            const config = getLanguageConfig("unknown-lang-xyz");
            assert.strictEqual(config, undefined);
        });
    });

    describe("getSupportedLanguageIds", () => {
        it("includes typescript and lua", () => {
            const ids = getSupportedLanguageIds();
            assert.ok(ids.includes("typescript"));
            assert.ok(ids.includes("lua"));
        });

        it("returns a non-empty array", () => {
            const ids = getSupportedLanguageIds();
            assert.ok(ids.length > 0);
        });
    });

    describe("getAllLanguageConfigs", () => {
        it("returns all registered configs", () => {
            const configs = getAllLanguageConfigs();
            assert.ok(configs.length > 0);
            assert.ok(configs.some((c) => c.id === "typescript"));
            assert.ok(configs.some((c) => c.id === "lua"));
        });
    });

    describe("getCommentPrefixes", () => {
        it("returns // for typescript", () => {
            const prefixes = getCommentPrefixes("typescript");
            assert.deepStrictEqual(prefixes, ["//"]);
        });

        it("returns -- for lua", () => {
            const prefixes = getCommentPrefixes("lua");
            assert.deepStrictEqual(prefixes, ["--"]);
        });

        it("returns # for python", () => {
            const prefixes = getCommentPrefixes("python");
            assert.deepStrictEqual(prefixes, ["#"]);
        });

        it("returns block start for HTML (no single-line prefix)", () => {
            const prefixes = getCommentPrefixes("html");
            assert.deepStrictEqual(prefixes, ["<!--"]);
        });

        it("returns fallback prefixes for unknown languages", () => {
            const prefixes = getCommentPrefixes("unknown-lang");
            assert.deepStrictEqual(prefixes, ["//", "#", "--"]);
        });
    });

    describe("registerLanguageConfig", () => {
        it("registers a new language", () => {
            registerLanguageConfig({
                id: "haskell",
                displayName: "Haskell",
                singleLine: ["--"],
                block: { start: "{-", end: "-}" },
            });
            const config = getLanguageConfig("haskell");
            assert.ok(config);
            assert.strictEqual(config.displayName, "Haskell");
            assert.deepStrictEqual(config.singleLine, ["--"]);
        });
    });

    describe("applyCustomPrefixes", () => {
        it("overrides prefixes for an existing language", () => {
            applyCustomPrefixes({ javascript: ["//", "#"] });
            const config = getLanguageConfig("javascript");
            assert.ok(config);
            assert.deepStrictEqual(config.singleLine, ["//", "#"]);
        });

        it("creates a new entry for an unknown language", () => {
            applyCustomPrefixes({ mylang: ["%%"] });
            const config = getLanguageConfig("mylang");
            assert.ok(config);
            assert.strictEqual(config.id, "mylang");
            assert.deepStrictEqual(config.singleLine, ["%%"]);
        });
    });
});
