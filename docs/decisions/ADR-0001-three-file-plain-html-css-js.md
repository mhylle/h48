# ADR-0001: Three-File Plain HTML/CSS/JS Architecture

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Use three-file architecture (index.html, style.css, calculator.js) with no frameworks or build tools.
> **Context**: Need to choose web architecture for an HP-48-inspired RPN scientific calculator.
> **Alternatives**: Single-file HTML, Multi-module ES modules, Framework-based (React/Vue)
> **Impact**: Project structure, development workflow, deployment

---

## Context

Building a retro RPN scientific calculator as a web application. The app is a single-page tool with moderate JS complexity (stack engine, 25+ operations, history manager, UI controller). Need to balance code organization against tooling overhead.

## Decision

**We will use a three-file architecture (index.html, style.css, calculator.js) with no frameworks, build tools, or external dependencies.**

The JS file uses an internal module pattern with named objects (StackEngine, Operations, UIController, HistoryManager) for logical separation within one file.

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Single-file (all in index.html) | Simplest, one file to share | Hard to maintain, mixed concerns | JS complexity warrants separation |
| Multi-module ES modules | Maximum separation, testable | Requires HTTP server, over-engineered | file:// protocol won't work, too complex for scope |
| Framework (React/Vue) | Component model, state management | Build step, dependencies, learning curve | Overkill for a single-page calculator |

## Consequences

- **Positive**: Zero tooling overhead, works with file:// protocol, easy local development
- **Negative**: Single JS file may grow to 500+ lines; no module isolation for testing
- **Requires**: Disciplined internal code organization using named object modules
