import { describe, expect, it } from 'vitest';
import { answerMatches, clozeSentence, confusionPairs, containsWord, parseBulk, parseWordList, schedule } from '../src/model';
import type { Review, VocabItem } from '../src/types';

const item: VocabItem = {
  id: 'one', word: 'Café', sentence: 'We stopped at the Café after class.', note: '',
  createdAt: 0, dueAt: 0, intervalDays: 0, ease: 2.3, lapses: 0, reviewCount: 0
};

describe('practice model', () => {
  it('matches Unicode after normalisation and ignores case', () => {
    expect(answerMatches('cafe\u0301', 'CAFÉ')).toBe(true);
    expect(containsWord('We met at the cafe\u0301.', 'Café')).toBe(true);
    expect(clozeSentence(item.sentence, item.word)).toContain('_____');
  });

  it('schedules correct and incorrect answers', () => {
    expect(schedule(item, true, 1_000).dueAt).toBe(86_401_000);
    expect(schedule(item, false, 1_000).dueAt).toBe(601_000);
    expect(schedule(item, false, 1_000).lapses).toBe(1);
  });

  it('parses valid bulk lines and explains invalid lines', () => {
    const parsed = parseBulk('scarce | Water is scarce.\nbad line');
    expect(parsed.rows).toHaveLength(1);
    expect(parsed.errors[0]).toContain('Line 2');
  });

  it('parses a one-word-per-line list and reports repeats', () => {
    expect(parseWordList('elusive\nplausible\nmeticulous').words).toEqual(['elusive', 'plausible', 'meticulous']);
    expect(parseWordList('Café\ncafe\u0301').errors[0]).toContain('Line 2');
  });

  it('counts repeated confusion pairs', () => {
    const reviews: Review[] = [1, 2].map((n) => ({ id: String(n), itemId: 'one', answer: 'Café', typed: 'coffee', correct: false, reviewedAt: n }));
    expect(confusionPairs([item], reviews)[0]).toMatchObject({ answer: 'Café', typed: 'coffee', count: 2 });
  });
});
