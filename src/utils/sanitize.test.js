import { describe, it, expect, vi } from 'vitest';
import { sanitizeInput, validateEmail, createRateLimiter, debounce, truncate } from './sanitize';

describe('sanitizeInput', () => {
  it('escapes HTML special characters', () => {
    expect(sanitizeInput('<script>alert("xss")</script>')).toBe(
      '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
    );
  });

  it('returns empty string for non-string input', () => {
    expect(sanitizeInput(null)).toBe('');
    expect(sanitizeInput(undefined)).toBe('');
    expect(sanitizeInput(123)).toBe('');
  });

  it('handles normal strings without modification', () => {
    expect(sanitizeInput('Hello World')).toBe('Hello World');
  });

  it('escapes ampersands', () => {
    expect(sanitizeInput('A & B')).toBe('A &amp; B');
  });

  it('escapes single quotes', () => {
    expect(sanitizeInput("it's")).toBe("it&#x27;s");
  });
});

describe('validateEmail', () => {
  it('validates correct emails', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.in')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false);
    expect(validateEmail('@no-local.com')).toBe(false);
    expect(validateEmail('no-at-sign')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });

  it('returns false for non-string input', () => {
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail(123)).toBe(false);
  });
});

describe('createRateLimiter', () => {
  it('allows first call', () => {
    const limiter = createRateLimiter(1000);
    expect(limiter.canProceed()).toBe(true);
  });

  it('blocks rapid successive calls', () => {
    const limiter = createRateLimiter(1000);
    limiter.canProceed(); // first call
    expect(limiter.canProceed()).toBe(false);
  });

  it('allows call after reset', () => {
    const limiter = createRateLimiter(1000);
    limiter.canProceed();
    limiter.reset();
    expect(limiter.canProceed()).toBe(true);
  });
});

describe('debounce', () => {
  it('delays function execution', async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    expect(fn).not.toHaveBeenCalled();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });

  it('resets timer on rapid calls', () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const debounced = debounce(fn, 100);
    debounced();
    debounced();
    debounced();
    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});

describe('truncate', () => {
  it('truncates long strings', () => {
    const long = 'a'.repeat(150);
    const result = truncate(long, 100);
    expect(result.length).toBe(103); // 100 + '...'
    expect(result.endsWith('...')).toBe(true);
  });

  it('does not truncate short strings', () => {
    expect(truncate('hello', 100)).toBe('hello');
  });

  it('returns empty string for non-string', () => {
    expect(truncate(null)).toBe('');
    expect(truncate(42)).toBe('');
  });
});
