import { containsWord, sampleData } from './model';
import type { ExportData, Review, VocabItem } from './types';

const DB_VERSION = 1;

export class VocabularyStore {
  private dbPromise: Promise<IDBDatabase>;
  readonly demo: boolean;

  constructor(demo: boolean) {
    this.demo = demo;
    this.dbPromise = this.open();
  }

  private open(): Promise<IDBDatabase> {
    const name = this.demo ? 'context-cloze-demo' : 'context-cloze-real';
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(name, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('items')) db.createObjectStore('items', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('reviews')) db.createObjectStore('reviews', { keyPath: 'id' });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  private async request<T>(storeName: 'items' | 'reviews', mode: IDBTransactionMode, action: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const request = action(transaction.objectStore(storeName));
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  getItems(): Promise<VocabItem[]> { return this.request('items', 'readonly', (store) => store.getAll()); }
  getReviews(): Promise<Review[]> { return this.request('reviews', 'readonly', (store) => store.getAll()); }
  putItem(item: VocabItem): Promise<IDBValidKey> { return this.request('items', 'readwrite', (store) => store.put(item)); }
  addReview(review: Review): Promise<IDBValidKey> { return this.request('reviews', 'readwrite', (store) => store.put(review)); }
  deleteItem(id: string): Promise<undefined> { return this.request('items', 'readwrite', (store) => store.delete(id)); }
  clearItems(): Promise<undefined> { return this.request('items', 'readwrite', (store) => store.clear()); }
  clearReviews(): Promise<undefined> { return this.request('reviews', 'readwrite', (store) => store.clear()); }

  async seedDemo(force = false): Promise<void> {
    if (!this.demo) return;
    const current = await this.getItems();
    if (current.length && !force) return;
    await Promise.all([this.clearItems(), this.clearReviews()]);
    const data = sampleData();
    await Promise.all([...data.items.map((item) => this.putItem(item)), ...data.reviews.map((review) => this.addReview(review))]);
  }

  async exportData(): Promise<ExportData> {
    return {
      product: 'context-cloze-vocab', version: 1, exportedAt: new Date().toISOString(),
      items: await this.getItems(), reviews: await this.getReviews()
    };
  }

  async importData(data: unknown): Promise<number> {
    if (!data || typeof data !== 'object') throw new Error('This file does not contain Context Cloze data.');
    const parsed = data as Partial<ExportData>;
    if (parsed.product !== 'context-cloze-vocab' || parsed.version !== 1 || !Array.isArray(parsed.items)) {
      throw new Error('Choose a Context Cloze JSON export.');
    }
    const safe = parsed.items.filter((item): item is VocabItem => Boolean(
      item && typeof item.id === 'string' && typeof item.word === 'string' &&
      typeof item.sentence === 'string' && containsWord(item.sentence, item.word) &&
      typeof item.createdAt === 'number' && typeof item.dueAt === 'number' &&
      typeof item.intervalDays === 'number' && typeof item.ease === 'number' &&
      typeof item.lapses === 'number' && typeof item.reviewCount === 'number'
    ));
    if (safe.length !== parsed.items.length) throw new Error('Some imported words are incomplete or do not appear in their sentences.');
    await Promise.all(safe.map((item) => this.putItem(item)));
    if (Array.isArray(parsed.reviews)) {
      const safeReviews = parsed.reviews.filter((review): review is Review => Boolean(
        review && typeof review.id === 'string' && typeof review.itemId === 'string' &&
        typeof review.answer === 'string' && typeof review.typed === 'string' &&
        typeof review.correct === 'boolean' && typeof review.reviewedAt === 'number'
      ));
      if (safeReviews.length !== parsed.reviews.length) throw new Error('Some imported answer history is incomplete.');
      await Promise.all(safeReviews.map((review) => this.addReview(review)));
    }
    return safe.length;
  }
}
