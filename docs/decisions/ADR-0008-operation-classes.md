# ADR-0008: Operation Classes in Feature Folder

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Each operation category is a separate class in `src/operations/` receiving StackEngine via constructor.
> **Context**: ADR-0005's category sub-objects were tightly coupled to a global StackEngine; refactoring to classes enables testing.
> **Alternatives**: Single Operations class with category methods, functional approach with pure functions
> **Impact**: src/operations/ folder, StackEngine dependency, dispatch registration, supersedes ADR-0005

---

## Context

ADR-0005 organized operations as category sub-objects within a single `Operations` const. While this achieved Rule of 7 compliance, all operations directly referenced the global `StackEngine` singleton, preventing independent unit testing and reuse.

## Decision

**We will use 7 individual operation classes, each receiving StackEngine via constructor injection.**

Classes: Arithmetic, Trigonometric, Logarithmic, Power, Constant, Misc, Bitwise. Each lives in `src/operations/` with a colocated `.spec.js` test file. Operations are registered with ActionDispatcher via `registerOperation()`.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Single class with sub-methods | Fewer files | Violates single responsibility, large file | Rule of 7 concern |
| Pure functions | No class boilerplate | Need to pass stack to every call | More verbose at call sites |

## Consequences

- **Positive**: Each operation class is independently testable with a fresh StackEngine; clean separation
- **Negative**: 7 class files + 7 spec files = 14 files for operations alone
- **Requires**: ActionDispatcher to register each operation; main.js wires all instances

## Related

- [ADR-0005](./ADR-0005-operations-category-sub-objects.md): Superseded by this ADR
- [ADR-0007](./ADR-0007-class-per-file-modules.md): Establishes the class-per-file pattern used here
