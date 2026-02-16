# ADR-0003: localStorage for History Persistence

> **Quick Reference** | Status: Accepted | Date: 2026-02-16
> **Decision**: Use localStorage with JSON serialization to persist calculation history across browser sessions.
> **Context**: Calculator needs persistent history that survives page reloads without a backend server.
> **Alternatives**: Session-only (no persistence), IndexedDB, Cookie storage
> **Impact**: HistoryManager module, data format, storage limits

---

## Context

The RPN calculator captures a history of every operation (expression, result, stack snapshot, timestamp). Users expect history to survive page reloads and browser restarts. No backend server is available since this is a static HTML/CSS/JS application.

## Decision

**We will use localStorage with key `statr-history` to persist history as a JSON array, capped at 100 entries.**

Save occurs after each operation. Load occurs on page init. Graceful fallback (history works in-memory only) if localStorage is unavailable (e.g., private browsing).

## Alternatives Considered

| Option | Pros | Cons | Why Not |
|--------|------|------|---------|
| Session-only (no persistence) | Zero complexity | History lost on reload | User explicitly requested persistence |
| IndexedDB | Larger storage, async, structured | Complex API, overkill for 100 JSON entries | Too heavy for simple key-value storage |
| Cookies | Universal support | 4KB limit, sent with requests, poor fit for structured data | Far too small for history entries |

## Consequences

- **Positive**: Simple synchronous API; 5-10MB storage limit is more than sufficient for 100 entries; no dependencies
- **Negative**: Synchronous writes could block UI on slow devices (mitigated by small data size); no cross-device sync
- **Requires**: try/catch around storage calls for private browsing; max 100 entries with oldest-removed eviction
