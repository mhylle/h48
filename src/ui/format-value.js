export function formatValue(value) {
  if (!isFinite(value)) return String(value);
  if (Number.isInteger(value) && Math.abs(value) < 1e12) return String(value);
  return Number(value.toPrecision(12)).toString();
}
