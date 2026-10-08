# Migrating these examples from Langium 2.0 to Langium 4.4

The four projects (poll, Chess, hello-world, VideoGenerator) were generated with `yo langium` for
Langium 2.0 (2023). This version ports them to **Langium 4.4**, keeping the flat
layout of each project (so `poll/src/cli/main.ts`, `poll/src/cli/generator.ts`,
`Chess/src/cli/main.ts`, cited by the lab sheets, are still there). Checked: `npm install`,
`npm run langium:generate`, `npm run build` (tsc + esbuild bundles of the VS Code extension and of
the language server), the CLIs on `examples/`, Chess's 10 Vitest tests, and the language server
answering an LSP `initialize` request.

Requirements: **Node.js ≥ 20.10, npm ≥ 11.6** (Node 24 LTS). With npm 10 (or npm < 11.6), `npm install` of a fresh
Langium 4.4 project crashes (`Cannot read properties of null (reading 'edgesOut')`). Workaround:
`npm install --legacy-peer-deps`.

## Is it that different?

Not much in the code: per project, about **30 lines in 5 files**. The rest is configuration, and the
removal of the web demo of the Langium 2 template. What changed between 2.0 and 4.4 that matters here:

- **3.0 (Feb. 2024)**: ESM only; the API is split into entry points — LSP services in `langium/lsp`,
  code generation in `langium/generate`, Node.js file system in `langium/node`;
  `LangiumDocuments.getOrCreateDocument` is **async**; utility functions moved to namespaces
  (`AstUtils.streamAllContents`, `CstUtils`...).
- **4.0 (Jul. 2025)**: infix operator rules in grammars (`infix BinaryExpr on Primary: ...`),
  multi-target references, a new layout of the generated `ast.ts`, the scope computation hooks
  renamed (`computeExports` → `collectExportedSymbols`, `computeLocalScopes` →
  `collectLocalSymbols` / `addLocalSymbol`), `findDeclaration` → `findDeclarations`.
- **4.3 (Jun. 2026)**: LSP 3.18, hence `vscode-languageserver` / `vscode-languageclient` ~10.
- **The generator** (`yo langium`, generator-langium 4.x) now creates an npm-workspaces monorepo
  (`packages/language`, `packages/cli`, `packages/extension`) instead of one flat package. These
  examples stay flat; students' projects will be monorepos (same files, other folders:
  `src/language/` ↔ `packages/language/src/`, `src/cli/` ↔ `packages/cli/src/`).

## The changes, file by file

**package.json** — `langium` and `langium-cli` `~4.4.0`; `vscode-languageclient` and
`vscode-languageserver` `~10.1.0` (the server package is now an explicit dependency);
`typescript ~5.9`, `esbuild 0.28`, `@types/node ~20`, `@types/vscode ~1.91` (and `engines.vscode
^1.91`), `commander ~15`, `chalk ~5.6`, `vitest ~4.1` (Chess). Removed: Monaco editor wrapper,
express, eslint 8 and their scripts. Added `"allowScripts": {"esbuild@0.28.2": true}`: npm 11
blocks install scripts unless they are allowed.

**tsconfig.json** — `"module": "NodeNext", "moduleResolution": "NodeNext"` (required to resolve the
`langium/lsp`, `langium/node`, `langium/generate` subpath exports), `target`/`lib` ES2022,
`"types": ["node"]`. `tsconfig.monarch.json` removed.

**langium-config.json** — unchanged except the `monarch` output, removed with the web demo.

**src/language/xxx-module.ts**

```ts
// Langium 2.0
import type { DefaultSharedModuleContext, LangiumServices, LangiumSharedServices, Module, PartialLangiumServices } from 'langium';
import { createDefaultModule, createDefaultSharedModule, inject } from 'langium';
// Langium 4.4
import { type Module, inject } from 'langium';
import { createDefaultModule, createDefaultSharedModule, type DefaultSharedModuleContext, type LangiumServices,
         type LangiumSharedServices, type PartialLangiumServices } from 'langium/lsp';
```

and, at the end of `createXxxServices`, outside a language server (CLI, tests):

```ts
if (!context.connection) {
    shared.workspace.ConfigurationProvider.initialized({});
}
```

**src/language/main.ts** (language server) — `import { startLanguageServer } from 'langium/lsp';`
and `'vscode-languageserver/node'` (no `.js`: the package now has an `exports` map).

**src/extension/main.ts** — `'vscode-languageclient/node'` (no `.js`).

**src/cli/cli-util.ts** — `LangiumServices` → `LangiumCoreServices`, and

```ts
const document = await services.shared.workspace.LangiumDocuments.getOrCreateDocument(URI.file(path.resolve(fileName)));
```

**src/cli/generator.ts** — `import { CompositeGeneratorNode, NL, toString } from 'langium/generate';`
(`expandToNode`, `joinToNode` and template strings `expandToString` are there too).

**Tests** (Chess) — unchanged: `parseDocument` / `parseHelper` from `langium/test`, `EmptyFileSystem`
from `langium`.

## Bugs found on the way (they were already there with Langium 2.0)

- **poll did not compile**: the generator reads `question.text`, but the grammar did not assign the
  question's text (`'Question' id=ID '{' STRING ...`). Fixed: `text=STRING`.
- **CLI not called** in hello-world and VideoGenerator (the README's "main is not exposed"):
  `bin/cli.js` imported `out/cli/main.js` without calling its default export (and without the
  `.js` extension that ESM requires). Fixed like poll: `import main from '../out/cli/main.js'; main();`.
- **VideoGenerator**: `require('../../package.json')` in an ES module; now read with `fs`.
- **Chess**: the range `^1.0.0-beta.6` of chess.js installs chess.js 1.x today, whose `pgn()`
  prints default PGN headers, so 5 tests failed even without the Langium upgrade. The movetext is
  now built from `chess.history()`.

## Removed: the web demo

The Langium 2 template's browser demo (Monaco editor wrapper 1.6 + a web worker language server +
express) only displayed an empty editor. Its libraries have changed completely since (today:
`monaco-languageclient` / `@typefox/monaco-editor-react`); for a browser demo of a DSL, the
[Langium playground](https://langium.org/playground/) or the MiniLogo web tutorial are simpler.

## Alternative

Regenerate each example with `yo langium` (4.4) and copy the grammar, validator and generator into
the monorepo layout: the examples would then look exactly like the students' projects, at the cost
of changing the paths cited in the sheets.
