import { describe, expect, it } from 'vitest';
import { sites } from '@/core/sites';
import { cleanText, cleanUrl, hostMatches } from '@/core/url';
import { rules } from '@/rules';

describe.each(rules)('$name', (rule) => {
  it.each(rule.examples)('%s', (before, after) => {
    expect(hostMatches(new URL(before).hostname, rule.hosts)).toBe(true);
    expect(cleanUrl(before, sites)).toBe(after);
  });
});

describe('rules', () => {
  it('have unique ids', () => {
    const ids = rules.map((rule) => rule.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('have unique hosts', () => {
    const hosts = rules.flatMap((rule) => rule.hosts);
    expect(new Set(hosts).size).toBe(hosts.length);
  });

  it('have at least one example', () => {
    for (const rule of rules) expect(rule.examples.length, rule.id).toBeGreaterThan(0);
  });
});

describe('cleanText', () => {
  it('cleans every link in a text and keeps trailing punctuation', () => {
    expect(cleanText('See https://youtu.be/abc?si=x, and https://x.com/a/status/1?s=20.', sites)).toBe(
      'See https://youtu.be/abc, and https://x.com/a/status/1.',
    );
  });

  it('leaves unsupported and already clean links untouched', () => {
    const text = 'https://example.com/?si=x https://youtu.be/abc';
    expect(cleanText(text, sites)).toBe(text);
  });
});
