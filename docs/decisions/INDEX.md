# Architectural Decision Records

Quick reference index for all architectural decisions. Read this file first to identify relevant ADRs.

## Active Decisions

| ADR | Decision | Impact | Date |
|-----|----------|--------|------|
| [0001](./ADR-0001-three-file-plain-html-css-js.md) | Three-file plain HTML/CSS/JS, no frameworks or build tools | Project structure, deployment | 2026-02-16 |
| [0002](./ADR-0002-internal-module-pattern.md) | Five named object modules in single JS file (StackEngine, Operations, InputHandler, UIController, HistoryManager) | Code organization, maintainability | 2026-02-16 |
| [0003](./ADR-0003-localstorage-history-persistence.md) | localStorage with JSON for history persistence, 100-entry cap | Data persistence, HistoryManager | 2026-02-16 |
| [0004](./ADR-0004-hp48-four-level-stack-model.md) | HP-48 fixed 4-level stack (X,Y,Z,T) with T-register duplication | StackEngine, operations, display | 2026-02-16 |
| [0005](./ADR-0005-operations-category-sub-objects.md) | Category sub-objects within Operations module for Rule of 7 compliance | Operations module, dispatch table | 2026-02-16 |

## Superseded Decisions

(none)

## By Category

### Architecture & Structure
- [ADR-0001](./ADR-0001-three-file-plain-html-css-js.md): Three-file plain HTML/CSS/JS architecture
- [ADR-0002](./ADR-0002-internal-module-pattern.md): Internal module pattern for JS organization

### Data & Storage
- [ADR-0003](./ADR-0003-localstorage-history-persistence.md): localStorage for history persistence

### Computation Model
- [ADR-0004](./ADR-0004-hp48-four-level-stack-model.md): HP-48 four-level stack model
- [ADR-0005](./ADR-0005-operations-category-sub-objects.md): Category sub-objects within Operations module
