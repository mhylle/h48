# ADR-0006: ES Modules with Dev Server

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Use ES modules (import/export) served via `npx serve` instead of file:// protocol.
> **Context**: Refactoring to proper separation of concerns requires a module system; file:// blocks ES module imports in browsers.
> **Alternatives**: Multiple script tags with globals, build step with bundler (esbuild/vite)
> **Impact**: Development workflow, project structure, deployment, supersedes ADR-0001

---

## Context

The original three-file architecture (ADR-0001) loaded via `file://` protocol, preventing use of ES `import`/`export`. Splitting the monolithic `calculator.js` into ~20 class-per-file modules requires a proper module system. Chrome blocks ES module imports on `file://` due to CORS policy.

## Decision

**We will use native ES modules with a lightweight `serve` dev server.**

Developers run `npm start` (which runs `npx serve .`) to serve the app at `http://localhost:3000`. All JavaScript files use `import`/`export`. The entry point is `<script type="module" src="src/main.js">`.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Multiple `<script>` tags | Works with file:// | No encapsulation, load order fragile | Defeats purpose of refactoring |
| Bundler (esbuild/vite) | Single output file | Adds build step, contradicts simplicity | Over-engineering for this project |

## Consequences

- **Positive**: True module encapsulation, clean dependency graph, enables unit testing of individual modules
- **Negative**: Developers must run `npm start`; `file://` protocol no longer works
- **Requires**: `serve` as devDependency, `package.json` scripts for start/test

## Related

- [ADR-0001](./ADR-0001-three-file-plain-html-css-js.md): Superseded by this ADR
