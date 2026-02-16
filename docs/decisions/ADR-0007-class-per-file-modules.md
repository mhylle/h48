# ADR-0007: Class-Per-File Module Structure

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: One exported class per file with constructor injection, organized in feature-based folders under `src/`.
> **Context**: The monolithic calculator.js had 5 tightly-coupled object literals with circular dependencies needing proper separation.
> **Alternatives**: Object literals in separate files, single class file with submodules, IIFE pattern
> **Impact**: All JS modules, file structure, testability, supersedes ADR-0002

---

## Context

The original internal module pattern (ADR-0002) used five `const` object literals in a single file. This created tight coupling (global references), circular dependencies (HistoryManager calling UIController.formatValue), and prevented unit testing of individual modules.

## Decision

**We will use one class per file with explicit constructor injection.**

Each module is a class exported from its own file. Dependencies are passed via constructor parameters. `src/main.js` serves as the composition root, instantiating all classes and wiring dependencies. Angular-inspired conventions: hyphen-separated filenames, feature-based folders, colocated `.spec.js` tests.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Object literals in separate files | Minimal change | No encapsulation, still uses globals | Doesn't solve coupling |
| DI framework | Full inversion of control | Over-engineering for small app | Unnecessary complexity |

## Consequences

- **Positive**: Each class is independently testable, dependencies are explicit, no circular references
- **Negative**: `main.js` composition root is longer (~140 lines), more files to navigate
- **Requires**: Consistent naming conventions, feature-based folder structure

## Related

- [ADR-0002](./ADR-0002-internal-module-pattern.md): Superseded by this ADR
- [ADR-0006](./ADR-0006-es-modules-dev-server.md): Enables this pattern via ES modules
