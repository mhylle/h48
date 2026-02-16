// Phase 3 verification tests - run with Node.js
// Simulates DOM to allow calculator.js to load

global.document = {
  addEventListener: () => {},
  querySelector: () => ({ addEventListener: () => {}, textContent: '' }),
  getElementById: () => ({ textContent: '' }),
};

const fs = require('fs');
let code = fs.readFileSync('C:/projects/agentic_learning/statr/calculator.js', 'utf8');
code = code.replace(/document\.addEventListener\('DOMContentLoaded'.*/, '');
code = code.replace(/document\.querySelector/g, '(() => ({ addEventListener: () => {}, textContent: "" }))');
code = code.replace(/document\.getElementById/g, '(() => ({ textContent: "" }))');
// Replace const with var so eval'd variables are accessible in outer scope
code = code.replace(/^const /gm, 'var ');
eval(code);

function reset() {
  StackEngine.clear();
  InputHandler.buffer = '';
  InputHandler.isNewEntry = true;
  InputHandler.liftPending = false;
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  reset();
  try {
    fn();
    passed++;
  } catch (e) {
    console.log('FAIL: ' + name + ' - ' + e.message);
    failed++;
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

function approx(a, b, tol) {
  return Math.abs(a - b) < (tol || 1e-10);
}

// === EXIT CONDITIONS FROM PLAN ===

test('0 sin = 0', () => {
  StackEngine.push(0);
  Operations.trig.sin();
  assert(StackEngine.peek() === 0, 'Expected 0, got ' + StackEngine.peek());
});

test('pi/2 sin ~ 1', () => {
  StackEngine.push(Math.PI / 2);
  Operations.trig.sin();
  assert(approx(StackEngine.peek(), 1), 'Expected ~1, got ' + StackEngine.peek());
});

test('e ln = 1', () => {
  StackEngine.push(Math.E);
  Operations.log.ln();
  assert(approx(StackEngine.peek(), 1), 'Expected 1, got ' + StackEngine.peek());
});

test('10 log10 = 1', () => {
  StackEngine.push(10);
  Operations.log.log10();
  assert(approx(StackEngine.peek(), 1), 'Expected 1, got ' + StackEngine.peek());
});

test('8 log2 = 3', () => {
  StackEngine.push(8);
  Operations.log.log2();
  assert(approx(StackEngine.peek(), 3), 'Expected 3, got ' + StackEngine.peek());
});

test('2 ENTER 10 pow = 1024', () => {
  StackEngine.push(2);
  StackEngine.push(10);
  Operations.power.pow();
  assert(StackEngine.peek() === 1024, 'Expected 1024, got ' + StackEngine.peek());
});

test('81 sqrt = 9', () => {
  StackEngine.push(81);
  Operations.power.sqrt();
  assert(StackEngine.peek() === 9, 'Expected 9, got ' + StackEngine.peek());
});

test('5 factorial = 120', () => {
  StackEngine.push(5);
  Operations.misc.factorial();
  assert(StackEngine.peek() === 120, 'Expected 120, got ' + StackEngine.peek());
});

test('12 AND 10 = 8', () => {
  StackEngine.push(12);
  StackEngine.push(10);
  Operations.bitwise.and();
  assert(StackEngine.peek() === 8, 'Expected 8, got ' + StackEngine.peek());
});

// === DOMAIN ERROR TESTS ===

test('sqrt(-1) returns error', () => {
  StackEngine.push(-1);
  const err = Operations.power.sqrt();
  assert(err === 'Square root of negative number', 'Expected error, got: ' + err);
  assert(StackEngine.peek() === -1, 'Stack should be restored');
});

test('ln(-1) returns error', () => {
  StackEngine.push(-1);
  const err = Operations.log.ln();
  assert(err === 'Logarithm of non-positive number', 'Expected error, got: ' + err);
  assert(StackEngine.peek() === -1, 'Stack should be restored');
});

test('ln(0) returns error', () => {
  StackEngine.push(0);
  const err = Operations.log.ln();
  assert(err === 'Logarithm of non-positive number', 'Expected error, got: ' + err);
});

test('log10(-5) returns error', () => {
  StackEngine.push(-5);
  const err = Operations.log.log10();
  assert(err === 'Logarithm of non-positive number', 'Expected error, got: ' + err);
});

test('log2(0) returns error', () => {
  StackEngine.push(0);
  const err = Operations.log.log2();
  assert(err === 'Logarithm of non-positive number', 'Expected error, got: ' + err);
});

test('asin(2) returns error', () => {
  StackEngine.push(2);
  const err = Operations.trig.asin();
  assert(err === 'Domain error', 'Expected error, got: ' + err);
  assert(StackEngine.peek() === 2, 'Stack should be restored');
});

test('acos(-2) returns error', () => {
  StackEngine.push(-2);
  const err = Operations.trig.acos();
  assert(err === 'Domain error', 'Expected error, got: ' + err);
});

test('factorial(-1) returns error', () => {
  StackEngine.push(-1);
  const err = Operations.misc.factorial();
  assert(err === 'Invalid factorial argument', 'Expected error, got: ' + err);
});

test('factorial(3.5) returns error', () => {
  StackEngine.push(3.5);
  const err = Operations.misc.factorial();
  assert(err === 'Invalid factorial argument', 'Expected error, got: ' + err);
});

test('factorial(171) returns overflow', () => {
  StackEngine.push(171);
  const err = Operations.misc.factorial();
  assert(err === 'Factorial overflow', 'Expected overflow error, got: ' + err);
});

test('mod with X=0 returns error', () => {
  StackEngine.push(10);
  StackEngine.push(0);
  const err = Operations.misc.mod();
  assert(err === 'Division by zero', 'Expected error, got: ' + err);
});

test('divide by zero still works', () => {
  StackEngine.push(10);
  StackEngine.push(0);
  const err = Operations.arithmetic.divide();
  assert(err === 'Division by zero', 'Expected error, got: ' + err);
});

// === ADDITIONAL OPERATION TESTS ===

test('cos(0) = 1', () => {
  StackEngine.push(0);
  Operations.trig.cos();
  assert(approx(StackEngine.peek(), 1), 'Expected 1, got ' + StackEngine.peek());
});

test('tan(0) = 0', () => {
  StackEngine.push(0);
  Operations.trig.tan();
  assert(approx(StackEngine.peek(), 0), 'Expected 0, got ' + StackEngine.peek());
});

test('asin(0) = 0', () => {
  StackEngine.push(0);
  Operations.trig.asin();
  assert(approx(StackEngine.peek(), 0), 'Expected 0, got ' + StackEngine.peek());
});

test('acos(1) = 0', () => {
  StackEngine.push(1);
  Operations.trig.acos();
  assert(approx(StackEngine.peek(), 0), 'Expected 0, got ' + StackEngine.peek());
});

test('atan(0) = 0', () => {
  StackEngine.push(0);
  Operations.trig.atan();
  assert(approx(StackEngine.peek(), 0), 'Expected 0, got ' + StackEngine.peek());
});

test('pi constant', () => {
  Operations.constant.pi();
  assert(StackEngine.peek() === Math.PI, 'Expected PI, got ' + StackEngine.peek());
});

test('e constant', () => {
  Operations.constant.e();
  assert(StackEngine.peek() === Math.E, 'Expected E, got ' + StackEngine.peek());
});

test('12 mod 5 = 2', () => {
  StackEngine.push(12);
  StackEngine.push(5);
  Operations.misc.mod();
  assert(StackEngine.peek() === 2, 'Expected 2, got ' + StackEngine.peek());
});

test('12 OR 10 = 14', () => {
  StackEngine.push(12);
  StackEngine.push(10);
  Operations.bitwise.or();
  assert(StackEngine.peek() === 14, 'Expected 14, got ' + StackEngine.peek());
});

test('12 XOR 10 = 6', () => {
  StackEngine.push(12);
  StackEngine.push(10);
  Operations.bitwise.xor();
  assert(StackEngine.peek() === 6, 'Expected 6, got ' + StackEngine.peek());
});

test('NOT 0 = -1', () => {
  StackEngine.push(0);
  Operations.bitwise.not();
  assert(StackEngine.peek() === -1, 'Expected -1, got ' + StackEngine.peek());
});

test('nthRoot: 27 cube root = 3', () => {
  StackEngine.push(27);
  StackEngine.push(3);
  Operations.power.nthRoot();
  assert(approx(StackEngine.peek(), 3), 'Expected 3, got ' + StackEngine.peek());
});

test('factorial(0) = 1', () => {
  StackEngine.push(0);
  Operations.misc.factorial();
  assert(StackEngine.peek() === 1, 'Expected 1, got ' + StackEngine.peek());
});

test('factorial(170) is finite', () => {
  StackEngine.push(170);
  Operations.misc.factorial();
  assert(isFinite(StackEngine.peek()), 'Expected finite, got ' + StackEngine.peek());
});

test('2 + 3 = 5 (arithmetic preserved)', () => {
  StackEngine.push(2);
  StackEngine.push(3);
  Operations.arithmetic.add();
  assert(StackEngine.peek() === 5, 'Expected 5, got ' + StackEngine.peek());
});

test('10 / 3 ~ 3.333 (arithmetic preserved)', () => {
  StackEngine.push(10);
  StackEngine.push(3);
  Operations.arithmetic.divide();
  assert(approx(StackEngine.peek(), 10 / 3), 'Expected ~3.333, got ' + StackEngine.peek());
});

test('5 - 3 = 2 (arithmetic preserved)', () => {
  StackEngine.push(5);
  StackEngine.push(3);
  Operations.arithmetic.subtract();
  assert(StackEngine.peek() === 2, 'Expected 2, got ' + StackEngine.peek());
});

test('4 * 7 = 28 (arithmetic preserved)', () => {
  StackEngine.push(4);
  StackEngine.push(7);
  Operations.arithmetic.multiply();
  assert(StackEngine.peek() === 28, 'Expected 28, got ' + StackEngine.peek());
});

test('log2(1) = 0', () => {
  StackEngine.push(1);
  Operations.log.log2();
  assert(approx(StackEngine.peek(), 0), 'Expected 0, got ' + StackEngine.peek());
});

test('log10(100) = 2', () => {
  StackEngine.push(100);
  Operations.log.log10();
  assert(approx(StackEngine.peek(), 2), 'Expected 2, got ' + StackEngine.peek());
});

// === DISPATCH TABLE TESTS (via UIController.dispatch) ===

test('dispatch: sin via dispatch', () => {
  StackEngine.push(0);
  UIController.dispatch.sin();
  assert(StackEngine.peek() === 0, 'Expected 0, got ' + StackEngine.peek());
});

test('dispatch: pi via dispatch', () => {
  UIController.dispatch.pi();
  assert(StackEngine.peek() === Math.PI, 'Expected PI, got ' + StackEngine.peek());
});

test('dispatch: e via dispatch', () => {
  UIController.dispatch.e();
  assert(StackEngine.peek() === Math.E, 'Expected E, got ' + StackEngine.peek());
});

test('dispatch: factorial via dispatch', () => {
  StackEngine.push(5);
  UIController.dispatch.factorial();
  assert(StackEngine.peek() === 120, 'Expected 120, got ' + StackEngine.peek());
});

test('dispatch: and via dispatch', () => {
  StackEngine.push(12);
  StackEngine.push(10);
  UIController.dispatch.and();
  assert(StackEngine.peek() === 8, 'Expected 8, got ' + StackEngine.peek());
});

test('dispatch: power via dispatch', () => {
  StackEngine.push(2);
  StackEngine.push(10);
  UIController.dispatch.power();
  assert(StackEngine.peek() === 1024, 'Expected 1024, got ' + StackEngine.peek());
});

test('dispatch: sqrt via dispatch', () => {
  StackEngine.push(81);
  UIController.dispatch.sqrt();
  assert(StackEngine.peek() === 9, 'Expected 9, got ' + StackEngine.peek());
});

test('dispatch: add via dispatch (arithmetic preserved)', () => {
  StackEngine.push(2);
  StackEngine.push(3);
  UIController.dispatch.add();
  assert(StackEngine.peek() === 5, 'Expected 5, got ' + StackEngine.peek());
});

console.log('\nResults: ' + passed + ' passed, ' + failed + ' failed');
if (failed > 0) process.exit(1);
console.log('ALL TESTS PASS');
