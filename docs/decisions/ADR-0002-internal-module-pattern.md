# ADR-0002: Internal Module Pattern for JS Organization

> **Quick Reference** | Status: Superseded by [ADR-0007](./ADR-0007-class-per-file-modules.md) | Date: 2026-02-16
> **Decision**: Organize calculator.js into five named object modules: StackEngine, Operations, InputHandler, UIController, HistoryManager.
> **Context**: Single JS file needs clear internal structure to manage RPN stack, 25+ operations, input state, UI binding, and history.
> **Alternatives**: Flat procedural code, Class-based OOP, IIFE modules
> **Impact**: calculator.js structure, code maintainability, testability

---

## Context

With all JS in a single file (per ADR-0001), we need an internal organization strategy. The calculator has five distinct concerns: stack data structure, mathematical operations, number input buffering, UI event handling/rendering, and history persistence.

## Decision

**We will use five named const objects as logical modules within calculator.js.**

```javascript
const StackEngine = { stack: [...], push() {}, pop() {}, ... };
const Operations = { add() {}, sin() {}, ... };
const InputHandler = { buffer: '', appendDigit() {}, commit() {}, ... };
const UIController = { init() {}, handleAction() {}, dispatch: {...}, ... };
const HistoryManager = { entries: [], record() {}, save() {}, ... };
```

InputHandler was extracted as a separate module (originally planned as part of StackEngine/UIController) to keep each module under the Rule of 7 method limit. It owns input buffer state, stack lift tracking, and number entry logic -- concerns distinct from both the stack data structure and the UI rendering.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Flat procedural | Simplest, no structure overhead | Becomes unmanageable at 500+ lines | Too many functions would collide |
| Class-based OOP | Encapsulation, familiar pattern | Over-formal for singleton objects, `this` binding issues | No need for multiple instances |
| IIFE modules | True encapsulation, private state | More boilerplate, harder to debug | Named objects are simpler and sufficient |

## Consequences

- **Positive**: Clear ownership of each concern; easy to navigate with search; modules can reference each other directly
- **Negative**: No true encapsulation (all properties are public); relies on developer discipline
- **Requires**: Consistent naming convention; each module responsible for one concern only
