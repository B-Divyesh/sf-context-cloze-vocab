export interface VocabItem {
  id: string;
  word: string;
  sentence: string;
  note: string;
  createdAt: number;
  dueAt: number;
  intervalDays: number;
  ease: number;
  lapses: number;
  reviewCount: number;
}

export interface Review {
  id: string;
  itemId: string;
  answer: string;
  typed: string;
  correct: boolean;
  reviewedAt: number;
}

export interface ExportData {
  product: 'context-cloze-vocab';
  version: 1;
  exportedAt: string;
  items: VocabItem[];
  reviews: Review[];
}

export interface LicenseState {
  token: string;
  valid: boolean;
  checkedAt: number;
}
