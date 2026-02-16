# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**statr** is an HP-48-inspired RPN scientific calculator — a single-page web app using plain HTML, CSS, and vanilla JavaScript. No frameworks, no build step, no bundler. Opens directly via `file://` protocol.

## Development

```bash
# Run tests (Playwright-based, headless Chromium)
npm install          # first time only — installs playwright
node test-rpn-calculator.js

# View the app — open index.html directly in a browser (no server needed)
```

There is no build, lint, or compile step. The three source files **are** the deliverable.

## Architecture

Three files, five internal modules (per ADR-0001 and ADR-0002):

**`index.html`** — Structure and button grid with `data-action` / `data-value` attributes. All operations are visible buttons (no shift keys).

**`style.css`** — CRT green-phosphor aesthetic (scanlines, glow, flicker). 6-column CSS Grid for buttons.

**`calculator.js`** — All logic, organized as five `const` object modules:

| Module | Responsibility |
|--------|---------------|
| `StackEngine` | Fixed 4-level stack (X,Y,Z,T) with HP-48 T-register duplication semantics |
| `Operations` | Pure math organized into 7 category sub-objects: `arithmetic`, `trig`, `log`, `power`, `constant`, `misc`, `bitwise` |
| `InputHandler` | Number entry buffer, decimal/EEX/negate, stack lift tracking |
| `HistoryManager` | Expression recording, localStorage persistence (key: `statr-history`, 100-entry cap), panel rendering |
| `UIController` | Event delegation, keyboard mapping, display rendering, action dispatch |

**Data flow**: Button click / keypress → `UIController.handleAction()` → `HistoryManager.beforeAction()` → dispatch function (commits input buffer, calls operation, sets `isNewEntry`) → `HistoryManager.afterAction()` → `UIController.updateDisplay()`

**Stack lift mechanism**: After ENTER or any operation, `isNewEntry = true`. The next digit triggers `InputHandler.liftStack()` which pushes a duplicate of X, then sets `liftPending = true` so that `commit()` overwrites X rather than pushing again.

## Design Principles

### Single Responsibility Principle
Every module, class, and function should have exactly one reason to change. If a function does two things, split it. If a module serves two purposes, extract one.

### Separation of Concerns
Keep distinct responsibilities in distinct layers/modules. Data access, business logic, and presentation should never be intermingled in the same function or class.

### Rule of 7
No function should have more than 7 lines of logic (excluding signatures, docstrings, and blank lines). No class should have more than 7 public methods. No module should have more than 7 classes or top-level functions. When a boundary is exceeded, decompose. This is why `Operations` uses category sub-objects (ADR-0005).

## Key Conventions

- Operations return an error string on failure or `undefined` on success — no exceptions for domain errors
- On error, operations push the original value back onto the stack before returning
- All trig functions operate in radians
- Bitwise operations truncate to 32-bit integers via `(x | 0)`
- The `KEYBOARD_MAP` object centralizes all keyboard shortcuts; `e` key is context-sensitive (EEX during number entry, Euler's constant otherwise)
- ADRs live in `docs/decisions/` — consult `INDEX.md` before making architectural changes
