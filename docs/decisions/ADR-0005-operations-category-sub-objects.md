# ADR-0005: Category Sub-Objects Within Operations Module

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Split Operations into category sub-objects (arithmetic, trig, log, power, constant, misc, bitwise) each with <= 7 methods.
> **Context**: Phase 3 adds 20 scientific operations to 4 existing arithmetic ops, exceeding Rule of 7 for a flat module.
> **Alternatives**: Flat Operations with 24+ methods, separate top-level modules per category
> **Impact**: Operations module structure, UIController dispatch table, Rule of 7 compliance

---

## Context

Phase 3 introduces trig (6), logarithmic (3), power/root (3), constants (2), factorial (1), modulo (1), and bitwise (4) operations on top of the 4 existing arithmetic methods. A flat Operations object with 24+ methods violates the Rule of 7 constraint from CLAUDE.md.

## Decision

**We will organize Operations as a top-level object containing category sub-objects, each with <= 7 methods.**

```javascript
const Operations = {
  arithmetic: { add, subtract, multiply, divide },
  trig:       { sin, cos, tan, asin, acos, atan },
  log:        { ln, log10, log2 },
  power:      { pow, sqrt, nthRoot },
  constant:   { pi, e },
  misc:       { factorial, mod },
  bitwise:    { and, or, xor, not },
};
```

Operations itself has 7 sub-objects. Each sub-object has <= 7 methods. The dispatch table references `Operations.trig.sin()` etc. This preserves ADR-0002's five named top-level modules.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Flat Operations (24+ methods) | Simple, direct | Violates Rule of 7 | Hard constraint from CLAUDE.md |
| Separate top-level modules per category | Clean separation | Violates ADR-0002's five-module pattern | Would require 8+ modules instead of 5 |

## Consequences

- **Positive**: Complies with Rule of 7 at both levels; preserves five-module architecture; logically groups related operations
- **Negative**: Slightly deeper call paths in dispatch table (e.g., `Operations.trig.sin()` vs `Operations.sin()`)
- **Requires**: Existing arithmetic methods must move under `Operations.arithmetic`; dispatch table must be updated

## Related

- [ADR-0002](./ADR-0002-internal-module-pattern.md): Five named modules pattern (Operations remains one of them)
