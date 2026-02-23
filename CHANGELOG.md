# Changelog

All notable changes to the **StreamGuard** extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [1.3.0] — 2026-02-23

### Added

- **Custom decoration color** — new `streamGuard.decorationColor` setting lets you pick any CSS hex color (e.g. `#ff0000`) for the masking overlay. Defaults to the editor warning theme color when left empty.

## [1.0.0] — 2026-02-22

### Added

- **Stream mode toggle** — `StreamGuard: Toggle Stream Mode` command and status bar button.
- **Comment-based masking** — `@stream-guard-next`, `@stream-guard-inline`, `@stream-guard-start` / `@stream-guard-end` annotations.
- **File/folder pattern masking** — glob-based whole-file masking via `streamGuard.maskedFilePatterns` and `streamGuard.maskedFolders`.
- **Custom language comment prefixes** — override comment syntax per language ID via `streamGuard.languageCommentPrefixes`.
- **Built-in language support** — 20+ languages with pre-configured comment syntax.
- **Real-time updates** — decorations refresh instantly on every document change or config change.
