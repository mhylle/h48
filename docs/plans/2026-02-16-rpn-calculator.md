# Implementation Plan: Retro RPN Scientific Calculator

## Overview

Build an HP-48-inspired RPN scientific calculator as a single-page web application using plain HTML, CSS, and JavaScript. The calculator features a 4-level stack display with green phosphor CRT aesthetics, comprehensive scientific operations accessible without shift keys, persistent history via localStorage, and full keyboard shortcut support.

## Context

The HP-48 series calculators (1990s) used Reverse Polish Notation with an unlimited stack, a multi-line display showing 4 stack levels (X, Y, Z, T), and a physical layout with shift keys to access hundreds of functions. Our web version simplifies the input model by making all operations directly accessible as visible buttons, while preserving the core RPN stack behavior and the iconic green-on-dark visual identity.

Key RPN behavior to replicate:
- Numbers are typed and pushed onto the stack with ENTER
- Binary operators consume X and Y, push result to X
- Unary operators consume X, push result to X
- The T register duplicates to fill gaps when stack items are consumed
- Stack levels display bottom-up: T (top of display), Z, Y, X (bottom, closest to input)

## Design Decision

**Three-file architecture** (`index.html`, `style.css`, `calculator.js`) with the JavaScript file using a clear internal structure organized into four logical modules: StackEngine, Operations, UIController, and HistoryManager. No build step, no frameworks, no dependencies.

## File Structure

```
C:\projects\agentic_learning\statr\
  index.html          -- HTML structure, all buttons, display layout
  style.css           -- CRT aesthetics, button grid, responsive design
  calculator.js       -- StackEngine, Operations, UIController, HistoryManager
  docs/
    plans/
      2026-02-16-rpn-calculator.md   -- This plan
```

---

## Implementation Phases

### Phase 1: Foundation -- HTML Structure and CRT Styling

**Objective**: Create the complete HTML layout and CSS styling so the calculator looks correct and retro before any interactivity is added.

**Verification**: Open `index.html` in a browser; visually confirm the 4-level stack display, all buttons rendered in the correct grid, and the green phosphor CRT aesthetic. No JS functionality yet.

**File: `index.html`**

Structure:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>statr - RPN Scientific Calculator</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="calculator">
    <div class="display-bezel">
      <div class="crt-overlay"></div>
      <div class="display">
        <div class="stack-line" id="stack-t"><span class="label">T:</span><span class="value">0</span></div>
        <div class="stack-line" id="stack-z"><span class="label">Z:</span><span class="value">0</span></div>
        <div class="stack-line" id="stack-y"><span class="label">Y:</span><span class="value">0</span></div>
        <div class="stack-line" id="stack-x"><span class="label">X:</span><span class="value">0</span></div>
        <div class="input-line" id="input-line"></div>
        <div class="status-line" id="status-line"></div>
      </div>
    </div>
    <div class="button-grid">
      <!-- All buttons with data-action attributes -->
    </div>
    <div class="history-panel" id="history-panel">
      <h3>History</h3>
      <div class="history-list" id="history-list"></div>
    </div>
  </div>
  <script src="calculator.js"></script>
</body>
</html>
```

Button grid layout (all visible, no shift keys):

| Row | Buttons |
|-----|---------|
| 1 | `sin` `cos` `tan` `asin` `acos` `atan` |
| 2 | `ln` `log10` `log2` `x^y` `sqrt` `x-root-y` |
| 3 | `pi` `e` `n!` `mod` `AND` `OR` |
| 4 | `XOR` `NOT` `SWAP` `DUP` `DROP` `CLEAR` |
| 5 | `7` `8` `9` `/` `+/-` `ENTER` (tall, spans 2 rows) |
| 6 | `4` `5` `6` `*` `EEX` (ENTER continues) |
| 7 | `1` `2` `3` `-` `BACK` |
| 8 | `0` `.` `+` |

**File: `style.css`**

Key CSS design decisions:

1. **Color palette**:
   - Background: `#1a1a1a` (calculator body), `#0d0d0d` (display)
   - Primary text: `#33ff33` (phosphor green)
   - Dim text: `#1a8c1a` (labels, inactive stack levels)
   - Button face: `#2a2a2a` with `#3a3a3a` hover
   - Button text: `#cccccc` (general), `#ff9933` (operations), `#33ff33` (stack ops)

2. **CRT effects** (on `.crt-overlay`):
   - Scanlines via repeating linear gradient
   - Subtle screen curvature via border-radius and inset box-shadow
   - Phosphor glow: `text-shadow: 0 0 5px #33ff33, 0 0 10px #33ff33, 0 0 20px #1a8c1a`
   - Subtle flicker animation

3. **Layout**: CSS Grid for buttons; flexbox for display stack lines. Monospace font. Right-aligned values, left-aligned labels.

4. **Responsive**: Max-width ~450px, centered. Mobile touch targets min 44px.

**Tasks**:
- [ ] Create `index.html` with full HTML structure including all buttons with `data-action` attributes
- [ ] Create `style.css` with complete retro CRT styling, button grid layout, responsive design
- [ ] Create `calculator.js` as empty placeholder
- [ ] Verify visual appearance in browser

---

### Phase 2: RPN Stack Engine and Basic Arithmetic

**Objective**: Implement the core RPN stack data structure and basic calculator operations (+, -, *, /), plus number entry, ENTER, and stack manipulation (SWAP, DUP, DROP, CLEAR).

**File: `calculator.js`** -- Internal architecture (5 modules, Rule of 7 compliant):

```javascript
// === STACK ENGINE === (7 methods)
const StackEngine = {
  stack: [0, 0, 0, 0],  // [X, Y, Z, T] - index 0 is X
  push(value) { ... }, pop() { ... }, peek() { ... },
  swap() { ... }, dup() { ... }, drop() { ... }, clear() { ... },
};

// === OPERATIONS === (4 methods, returns error string or undefined)
const Operations = {
  add() { ... }, subtract() { ... }, multiply() { ... }, divide() { ... },
};

// === INPUT HANDLER === (7 methods)
const InputHandler = {
  buffer: '', isNewEntry: true, liftPending: false,
  appendDigit(digit) { ... }, appendDecimal() { ... },
  backspace() { ... }, negate() { ... }, appendEEX() { ... },
  commit() { ... }, liftStack() { ... },
};

// === UI CONTROLLER === (6 methods + dispatch table)
const UIController = {
  init() { ... }, bindButtons() { ... }, updateDisplay() { ... },
  formatValue(value) { ... }, showError(message) { ... },
  handleAction(action, value) { ... },
  dispatch: { digit, decimal, enter, backspace, negate, eex,
              add, subtract, multiply, divide,
              swap, dup, drop, clear },
};
```

Key RPN behaviors:
1. Digits append to `InputHandler.buffer`. Display shows buffer in X position.
2. ENTER: commit buffer (push onto stack) or duplicate X if buffer empty.
3. Binary operation: commit buffer if non-empty. Pop X and Y, compute `Y op X`, push result.
4. Stack lift: after ENTER or operation, `isNewEntry = true`. First digit physically lifts the stack via `push(peek())`, then commit replaces X rather than pushing.

**Tasks**:
- [x] Implement `StackEngine` with push, pop, peek, swap, dup, drop, clear
- [x] Implement `Operations` for add, subtract, multiply, divide with error handling
- [x] Implement `UIController.init()` with event delegation on `.button-grid`
- [x] Implement `UIController.updateDisplay()` to render stack state
- [x] Implement `UIController.handleAction()` central dispatcher
- [x] Implement number entry: digits, decimal, backspace, negate, EEX
- [x] Implement error display in status line
- [x] Verify all basic operations in browser

**Exit Conditions**:
- [x] `2 ENTER 3 +` = 5
- [x] `10 ENTER 3 /` = 3.33333333333
- [x] `5 ENTER 0 /` shows "Error: Division by zero"
- [x] SWAP, DUP, DROP, CLEAR all work correctly
- [x] +/- toggles sign, Backspace deletes digits

---

### Phase 3: Scientific Operations

**Objective**: Add all scientific functions: trig, log, power/root, constants, factorial, modulo, bitwise.

**Operations to implement**:

| Category | Functions |
|----------|-----------|
| Trig | sin, cos, tan, asin, acos, atan (radians) |
| Logarithmic | ln, log10, log2 |
| Power/Root | x^y (binary), sqrt (unary), nth-root (binary) |
| Constants | pi, e |
| Other | factorial (integers 0-170), modulo (binary) |
| Bitwise | AND, OR, XOR (binary), NOT (unary) -- truncate to 32-bit int |

Domain validation:
- `sqrt(-1)` -> error
- `log(-1)` -> error
- `asin(2)` -> error
- `factorial(-1)` -> error

**Tasks**:
- [ ] Implement trig functions with domain validation
- [ ] Implement logarithm functions with domain validation
- [ ] Implement power, sqrt, nth-root
- [ ] Implement constant pushes (pi, e)
- [ ] Implement factorial with integer check and overflow protection (cap at 170)
- [ ] Implement modulo, handle X=0
- [ ] Implement bitwise operations with integer truncation
- [ ] Wire all operations into dispatcher
- [ ] Verify each operation with known values

**Exit Conditions**:
- [ ] `0 sin` = 0, `pi/2 sin` ~ 1
- [ ] `e ln` = 1, `10 log10` = 1, `8 log2` = 3
- [ ] `2 ENTER 10 x^y` = 1024, `81 sqrt` = 9
- [ ] `5 n!` = 120
- [ ] `12 ENTER 10 AND` = 8
- [ ] Domain errors show messages on display

---

### Phase 4: History and Persistence

**Objective**: Operation history panel with expression, result, and stack state. Persisted to localStorage. Clickable to reload onto stack.

```javascript
const HistoryManager = {
  entries: [],          // { expression, result, stackSnapshot, timestamp }
  maxEntries: 100,
  record(expression, result, stackSnapshot) { ... },
  save() { ... },       // localStorage key 'statr-history'
  load() { ... },
  renderToPanel() { ... },
};
```

History panel UI:
- Right side on desktop, below on mobile
- Each entry shows expression and result
- Click to push result onto stack
- "Clear History" button

**Tasks**:
- [ ] Implement `HistoryManager` with record, save, load, clear, renderToPanel
- [ ] Implement expression builder tracking human-readable expressions
- [ ] Integrate history recording into operation pipeline
- [ ] Implement clickable history entries
- [ ] Implement localStorage persistence (save after each op, load on init)
- [ ] Add "Clear History" button
- [ ] Style history panel in retro theme
- [ ] Handle localStorage unavailable gracefully

**Exit Conditions**:
- [ ] `5 ENTER 3 +` creates history entry showing "5 ENTER 3 +" = 8
- [ ] Click history entry pushes its value onto stack
- [ ] History survives page reload
- [ ] "Clear History" works
- [ ] Capped at 100 entries

---

### Phase 5: Keyboard Shortcuts and Visual Polish

**Objective**: Keyboard shortcuts for all operations, refined CRT effects, number formatting, responsive layout.

**Keyboard mapping**:

| Key | Action |
|-----|--------|
| `0-9` | Digit entry |
| `.` | Decimal point |
| `Enter` | ENTER |
| `+` `-` `*` `/` | Basic arithmetic |
| `Backspace` | Delete last digit |
| `Escape` | CLEAR |
| `s`/`S` | sin/asin |
| `c`/`C` | cos/acos |
| `t`/`T` | tan/atan |
| `l`/`L` | ln/log10 |
| `^` | x^y |
| `q` | sqrt |
| `p` | push pi |
| `e` | push e (or EEX during number entry) |
| `!` | factorial |
| `%` | modulo |
| `x` | SWAP |
| `d` | DUP |
| `n` | negate |
| `&` `\|` `~` | AND, OR, NOT |

**CRT enhancements**:
- Animated scanlines scrolling downward
- Subtle flicker (opacity 0.97-1.0)
- Corner darkening via inset box-shadow
- Button press feedback (translateY on :active)
- Keyboard shortcut hint labels on buttons

**Number formatting**:
- Scientific notation for >12 digits
- Consistent decimal display

**Tasks**:
- [ ] Implement keydown event listener with full mapping
- [ ] Handle `e` key context (EEX vs Euler)
- [ ] Prevent browser defaults for calculator keys
- [ ] Add shortcut hint labels to buttons
- [ ] Enhance CRT effects (animated scanlines, flicker, curvature)
- [ ] Add button press visual feedback
- [ ] Improve number formatting
- [ ] Test responsive layout (320px, 375px, 768px)
- [ ] Cross-browser testing

---

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| JS floating point precision | Format to 12 significant digits; document IEEE 754 behavior |
| localStorage quota | Limit history to 100 entries; handle QuotaExceededError |
| Keyboard shortcut conflicts | Selective preventDefault(); cross-browser testing |
| CRT effects performance | CSS-only animations, no JS animation loops |
| Factorial overflow | Cap at 170; clear error for larger values |
| Touch targets too small | Enforce min 44x44px on buttons |

## Dependencies

None. Plain HTML/CSS/JS, any modern browser.
