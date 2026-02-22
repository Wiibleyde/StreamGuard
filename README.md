# StreamHider — VSCode Extension

Hide sensitive parts of your code **visually** during live streams (Twitch, YouTube, etc.) without ever modifying the actual source files.

All hiding is done via the VSCode `TextEditorDecorationType` API — purely visual and non-destructive.

---

## Features

- **File/folder hiding** — glob-pattern-based full-file hiding via workspace settings
- **Inline comment hiding** — annotate individual lines or blocks with special comments
- **Status bar indicator** — always know whether stream mode is active
- **Toggle command** — quickly enable/disable with `StreamHider: Toggle Stream Mode`
- **Real-time updates** — decorations refresh instantly on every document change or config change

---

## Comment Syntax

| Annotation | Effect |
|---|---|
| `// @stream-hide-next` | Hides the **next** line |
| `// @stream-hide-inline` | Hides the line that contains this annotation |
| `// @stream-hide-start` | Starts a hidden block |
| `// @stream-hide-end` | Ends a hidden block |

### Examples

```ts
// @stream-hide-next
const apiKey = "super-secret-key";   // ← this line is hidden

const token = process.env.TOKEN;     // @stream-hide-inline  ← this line is hidden

// @stream-hide-start
const dbPassword = "hunter2";
const dbUser = "admin";
// @stream-hide-end
// ↑ everything between start/end is hidden
```

---

## Configuration (`.vscode/settings.json`)

```json
{
  "streamHider.enabled": true,
  "streamHider.hiddenFilePatterns": ["**/.env", "**/secrets.*"],
  "streamHider.hiddenFolders": ["**/private/**"],
  "streamHider.replacement": "[ 🔴 HIDDEN ]"
}
```

| Setting | Type | Default | Description |
|---|---|---|---|
| `streamHider.enabled` | `boolean` | `false` | Toggle the extension globally |
| `streamHider.hiddenFilePatterns` | `string[]` | `[]` | Glob patterns — files matching these have their entire content hidden |
| `streamHider.hiddenFolders` | `string[]` | `[]` | Glob patterns — files inside matching folders are fully hidden |
| `streamHider.replacement` | `string` | `[ 🔴 HIDDEN ]` | Placeholder text shown in place of hidden content |

---

## Commands

| Command | Description |
|---|---|
| `StreamHider: Toggle Stream Mode` | Enables or disables stream hiding |

---

## Development

```bash
npm install
npm run compile      # TypeScript build
npm test             # Run unit tests (mocha, no VSCode needed)
npm run lint         # Biome linter
npm run format       # Biome formatter
```

---

## Project Structure

```
src/
├── extension.ts               # Entry point (activate / deactivate)
├── constants.ts               # Command ids, config keys, comment tokens
├── types.ts                   # Shared TypeScript types
├── hide/
│   ├── comment-parser.ts      # Parse @stream-hide-* comments
│   ├── decoration-provider.ts # Apply/clear VSCode decorations
│   ├── hide-manager.ts        # Main orchestrator
│   └── pattern-matcher.ts     # Glob pattern matching for files/folders
├── config/
│   ├── workspace-config.ts    # Read streamHider config from workspace
│   └── config-watcher.ts      # React to config changes
└── utils/
    └── logger.ts              # Internal logger using OutputChannel
```