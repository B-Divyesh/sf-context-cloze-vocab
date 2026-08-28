import type { Review, VocabItem } from './types';

export const DAY = 86_400_000;

export const normalizeAnswer = (value: string): string =>
  value.normalize('NFKC').trim().toLocaleLowerCase().replace(/[\s\u00a0]+/g, ' ');

export const answerMatches = (typed: string, answer: string): boolean =>
  normalizeAnswer(typed) === normalizeAnswer(answer);

export const clozeSentence = (sentence: string, word: string): string => {
  const target = normalizeAnswer(word);
  const normalized = sentence.normalize('NFKC');
  const lower = normalized.toLocaleLowerCase();
  const index = lower.indexOf(target);
  if (index < 0) return sentence;
  return `${normalized.slice(0, index)}_____${normalized.slice(index + word.normalize('NFKC').length)}`;
};

export const containsWord = (sentence: string, word: string): boolean =>
  sentence.normalize('NFKC').toLocaleLowerCase().includes(normalizeAnswer(word));

export function newItem(word: string, sentence: string, note = '', now = Date.now()): VocabItem {
  return {
    id: crypto.randomUUID(),
    word: word.normalize('NFC').trim(),
    sentence: sentence.normalize('NFC').trim(),
    note: note.normalize('NFC').trim(),
    createdAt: now,
    dueAt: now,
    intervalDays: 0,
    ease: 2.3,
    lapses: 0,
    reviewCount: 0
  };
}

export function schedule(item: VocabItem, correct: boolean, now = Date.now()): VocabItem {
  if (!correct) {
    return { ...item, dueAt: now + 10 * 60_000, intervalDays: 0, ease: Math.max(1.3, item.ease - 0.2), lapses: item.lapses + 1, reviewCount: item.reviewCount + 1 };
  }
  const intervalDays = item.intervalDays === 0 ? 1 : item.intervalDays === 1 ? 3 : Math.max(4, Math.round(item.intervalDays * item.ease));
  return { ...item, dueAt: now + intervalDays * DAY, intervalDays, ease: Math.min(2.8, item.ease + 0.05), reviewCount: item.reviewCount + 1 };
}

export interface ConfusionPair { answer: string; typed: string; count: number }

export function confusionPairs(items: VocabItem[], reviews: Review[]): ConfusionPair[] {
  const answers = new Map(items.map((item) => [item.id, item.word]));
  const pairs = new Map<string, ConfusionPair>();
  for (const review of reviews) {
    if (review.correct || !review.typed.trim()) continue;
    const answer = answers.get(review.itemId) || review.answer;
    const key = `${normalizeAnswer(answer)}\u0000${normalizeAnswer(review.typed)}`;
    const pair = pairs.get(key);
    if (pair) pair.count += 1;
    else pairs.set(key, { answer, typed: review.typed.trim(), count: 1 });
  }
  return [...pairs.values()].sort((a, b) => b.count - a.count || a.answer.localeCompare(b.answer));
}

export function parseBulk(text: string): { rows: Array<{ word: string; sentence: string }>; errors: string[] } {
  const rows: Array<{ word: string; sentence: string }> = [];
  const errors: string[] = [];
  text.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trim();
    if (!line) return;
    const separator = line.includes('\t') ? '\t' : '|';
    const at = line.indexOf(separator);
    if (at < 1) {
      errors.push(`Line ${index + 1} needs a word, a |, and a sentence.`);
      return;
    }
    const word = line.slice(0, at).trim();
    const sentence = line.slice(at + 1).trim();
    if (!word || !sentence || !containsWord(sentence, word)) {
      errors.push(`Line ${index + 1} must include the exact word in its sentence.`);
      return;
    }
    rows.push({ word, sentence });
  });
  return { rows, errors };
}

const sampleRows = [
  ['meticulous', 'Mina kept meticulous notes while restoring the old map.', 'careful about small details'],
  ['plausible', 'His explanation sounded plausible until we checked the dates.', 'reasonable or believable'],
  ['scarce', 'Fresh water becomes scarce after a long dry season.', 'hard to find or obtain'],
  ['reluctant', 'I was reluctant to speak before I had all the facts.', 'not willing or eager'],
  ['elusive', 'The quiet melody remained elusive after the concert ended.', 'difficult to find or recall'],
  ['concise', 'A concise note was easier to read on the train.', 'brief but complete'],
  ['مُثابر', 'كان الطالب مُثابرًا رغم صعوبة الدرس.', 'Arabic: persistent'],
  ['慎重', '彼女は慎重な言葉を選びました。', 'Japanese: careful']
] as const;

export function sampleData(now = Date.now()): { items: VocabItem[]; reviews: Review[] } {
  const items = sampleRows.map(([word, sentence, note], index) => {
    const item = newItem(word, sentence, note, now - (index + 1) * DAY);
    item.dueAt = index < 5 ? now - index * 1000 : now + (index - 4) * DAY;
    item.intervalDays = index % 3;
    item.reviewCount = index < 6 ? index + 1 : 0;
    return item;
  });
  const mistakes = [
    [items[1], 'possible'],
    [items[1], 'probable'],
    [items[3], 'hesitant'],
    [items[4], 'vague'],
    [items[4], 'vague']
  ] as const;
  const reviews = mistakes.map(([item, typed], index): Review => ({
    id: crypto.randomUUID(), itemId: item.id, answer: item.word, typed,
    correct: false, reviewedAt: now - (index + 1) * DAY
  }));
  return { items, reviews };
}
