# ADR-0004: HP-48 Four-Level Stack Model

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Implement a fixed 4-level RPN stack (X, Y, Z, T) with T-register duplication, matching HP-48 behavior.
> **Context**: RPN calculators vary between unlimited stacks and fixed 4-level stacks; need to choose the computation model.
> **Alternatives**: Unlimited dynamic stack, 4-level with zero fill, 8-level stack
> **Impact**: StackEngine module, display layout, all operation implementations

---

## Context

RPN calculators historically use either an unlimited stack (modern implementations) or a fixed 4-level stack (HP-35 through HP-48 tradition). The display shows 4 registers: T (top), Z, Y, X (bottom/active). The stack model determines how push, pop, and operations behave at the boundaries.

## Decision

**We will implement a fixed 4-level stack (X, Y, Z, T) with classic HP-48 T-register duplication semantics.**

Key behaviors:
- Push: items shift up (T falls off), new value enters X
- Pop: items shift down, T duplicates to fill the gap
- Binary ops: consume X and Y, compute `Y op X`, push result to X
- Unary ops: consume X, push result to X
- ENTER with empty buffer: duplicates X

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Unlimited dynamic stack | No overflow, simpler push/pop | Display only shows 4 anyway, unfamiliar to HP users | Loses the tactile HP-48 feel |
| 4-level with zero fill | Simpler (no T duplication) | Incorrect HP behavior, loses useful T-dup feature | Deviates from HP-48 spec |
| 8-level stack | More workspace | Displays only 4, extra complexity for no visible benefit | No user-facing advantage |

## Consequences

- **Positive**: Authentic HP-48 experience; T-duplication enables useful patterns (e.g., constant multiplication)
- **Negative**: Stack overflow silently drops T; limited workspace for complex multi-step calculations
- **Requires**: All operations must correctly implement shift-up/shift-down with T-register duplication

## Related

- [ADR-0002](./ADR-0002-internal-module-pattern.md): StackEngine module owns this implementation
