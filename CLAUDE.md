# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**statr** is an HP-48-inspired RPN scientific calculator — a single-page web app using vanilla JavaScript ES modules. No frameworks, no build step, no bundler. Served via `npx serve`.

## Development

```bash
npm install                # first time only — installs playwright, vitest, serve
npm start                  # serves on http://localhost:3000
npm test                   # runs unit tests then e2e tests
npm run test:unit          # vitest — src/**/*.spec.js
npm run test:e2e           # playwright — test/e2e/*.e2e.js
npx vitest run src/core/stack-engine.spec.js   # single unit test file
```

There is no build, lint, or compile step.

## Architecture

ES modules with one class per file (ADR-0006, ADR-0007). `src/main.js` is the composition root — it instantiates all classes, wires dependencies via constructor injection, and registers operations with ActionDispatcher.

```
index.html                  Entry point, button grid (data-action/data-value)
src/
  main.js                   Composition root — wires all dependencies
  core/
    stack-engine.js          Fixed 4-level stack (X,Y,Z,T), T-register duplication
    input-handler.js         Number entry buffer, decimal/EEX/negate, stack lift
  operations/                7 classes, each receives StackEngine via constructor (ADR-0008)
    arithmetic.js            add, subtract, multiply, divide
    trigonometric.js         sin, cos, tan, asin, acos, atan
    logarithmic.js           ln, log10, log2
    power.js                 pow, sqrt, nthRoot
    constant.js              pi, e
    misc.js                  factorial, mod
    bitwise.js               and, or, xor, not
  ui/
    action-dispatcher.js     Generic dispatch: registerOperation(), registerConstant(), registerAction()
    display-renderer.js      Stack display rendering
    button-handler.js        Click event delegation
    keyboard-handler.js      Keydown handling
    keyboard-map.js          KEYBOARD_MAP constant
    format-value.js          Pure number formatting function
  features/history/
    history-store.js         Entry recording, localStorage persistence (100-entry cap)
    history-renderer.js      History panel DOM rendering
  styles/
    index.css                @import aggregator
    base.css, calculator.css, display.css, buttons.css, history.css, responsive.css
test/e2e/
  calculator.e2e.js          Playwright e2e tests
```

**Data flow**: Button click / keypress → `ActionDispatcher.dispatch()` → `HistoryStore.beforeAction()` → handler (commits input, calls operation, sets `isNewEntry`) → `HistoryStore.afterAction()` → `DisplayRenderer.update()`

**Dependency wiring** (in `main.js`):
```
StackEngine ← InputHandler
StackEngine ← Operations (7 classes)
StackEngine, InputHandler, formatValue ← DisplayRenderer
InputHandler, HistoryStore, DisplayRenderer ← ActionDispatcher
ActionDispatcher, KEYBOARD_MAP, InputHandler ← KeyboardHandler
ActionDispatcher ← ButtonHandler
HistoryStore → HistoryRenderer (via callback)
```

**Stack lift mechanism**: After ENTER or any operation, `isNewEntry = true`. The next digit triggers `InputHandler.liftStack()` which pushes a duplicate of X, then sets `liftPending = true` so that `commit()` overwrites X rather than pushing again.

## Code Style (Angular-inspired, per ADR-0007)

- **One class per file** — filename matches the class concept in `hyphen-case.js`
- **Feature-based folders** — group by feature (`core/`, `operations/`, `ui/`, `features/history/`)
- **Constructor injection** — dependencies passed in constructor, no global singletons
- **Colocated tests** — `foo.spec.js` next to `foo.js` (unit tests via vitest)
- **ES import/export** — named exports, no default exports

## Design Principles

### Single Responsibility Principle
Every module, class, and function should have exactly one reason to change.

### Separation of Concerns
Data access, business logic, and presentation should never be intermingled in the same function or class.

### Rule of 7
No function > 7 lines of logic. No class > 7 public methods. No module > 7 classes. When exceeded, decompose.

## Key Conventions

- Operations return an error string on failure or `undefined` on success — no exceptions for domain errors
- On error, operations push the original value back onto the stack before returning
- All trig functions operate in radians
- Bitwise operations truncate to 32-bit integers via `(x | 0)`
- `KEYBOARD_MAP` centralizes all keyboard shortcuts; `e` key is context-sensitive (EEX during number entry, Euler's constant otherwise)
- `ActionDispatcher.registerOperation()` wraps the common commit → call → isNewEntry pattern
- ADRs live in `docs/decisions/` — consult `INDEX.md` before making architectural changes
