# Architectural Decision Records

Quick reference index for all architectural decisions. Read this file first to identify relevant ADRs.

## Active Decisions

| ADR | Decision | Impact | Date |
|-----|----------|--------|------|
| [0003](./ADR-0003-localstorage-history-persistence.md) | localStorage with JSON for history persistence, 100-entry cap | Data persistence, HistoryStore | 2026-02-16 |
| [0004](./ADR-0004-hp48-four-level-stack-model.md) | HP-48 fixed 4-level stack (X,Y,Z,T) with T-register duplication | StackEngine, operations, display | 2026-02-16 |
| [0006](./ADR-0006-es-modules-dev-server.md) | ES modules with `npx serve` dev server, replaces file:// protocol | Development workflow, project structure | 2026-02-16 |
| [0007](./ADR-0007-class-per-file-modules.md) | One class per file with constructor injection, feature-based folders | All JS modules, testability | 2026-02-16 |
| [0008](./ADR-0008-operation-classes.md) | 7 operation classes in src/operations/ with StackEngine injection | Operations, dispatch, testing | 2026-02-16 |

## Superseded Decisions

| ADR | Was | Replaced By | Date |
|-----|-----|-------------|------|
| [0001](./ADR-0001-three-file-plain-html-css-js.md) | Three-file plain HTML/CSS/JS, file:// protocol | ADR-0006 | 2026-02-16 |
| [0002](./ADR-0002-internal-module-pattern.md) | Five object-literal modules in single JS file | ADR-0007 | 2026-02-16 |
| [0005](./ADR-0005-operations-category-sub-objects.md) | Category sub-objects within Operations module | ADR-0008 | 2026-02-16 |

## By Category

### Architecture & Structure
- [ADR-0001](./ADR-0001-three-file-plain-html-css-js.md): ~~Three-file plain HTML/CSS/JS~~ (superseded)
- [ADR-0002](./ADR-0002-internal-module-pattern.md): ~~Internal module pattern~~ (superseded)
- [ADR-0006](./ADR-0006-es-modules-dev-server.md): ES modules with dev server
- [ADR-0007](./ADR-0007-class-per-file-modules.md): Class-per-file module structure

### Data & Storage
- [ADR-0003](./ADR-0003-localstorage-history-persistence.md): localStorage for history persistence

### Computation Model
- [ADR-0004](./ADR-0004-hp48-four-level-stack-model.md): HP-48 four-level stack model
- [ADR-0005](./ADR-0005-operations-category-sub-objects.md): ~~Category sub-objects~~ (superseded)
- [ADR-0008](./ADR-0008-operation-classes.md): Operation classes in feature folder
