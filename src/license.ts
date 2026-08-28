import type { LicenseState } from './types';

const SLUG = 'context-cloze-vocab';
const TOKEN_KEY = `sb_license:${SLUG}`;
const STATE_KEY = `sb_license_state:${SLUG}`;
const DAY = 86_400_000;

export const checkoutUrl = `https://api.sociobot.in/api/v1/products/${SLUG}/checkout`;

export function captureLicense(): void {
  const url = new URL(location.href);
  const token = url.searchParams.get('license');
  if (!token) return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(STATE_KEY, JSON.stringify({ token, valid: true, checkedAt: 0 } satisfies LicenseState));
  url.searchParams.delete('license');
  history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

export function licenseToken(): string { return localStorage.getItem(TOKEN_KEY) || ''; }

export function saveLicense(token: string): void {
  localStorage.setItem(TOKEN_KEY, token.trim());
  localStorage.removeItem(STATE_KEY);
}

export function clearLicense(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(STATE_KEY);
}

export function cachedLicense(): LicenseState | null {
  const token = licenseToken();
  if (!token) return null;
  try {
    const state = JSON.parse(localStorage.getItem(STATE_KEY) || '') as LicenseState;
    return state.token === token ? state : { token, valid: false, checkedAt: 0 };
  } catch {
    return { token, valid: false, checkedAt: 0 };
  }
}

export function isPro(): boolean { return cachedLicense()?.valid === true; }

export async function verifyLicense(force = false): Promise<LicenseState | null> {
  const token = licenseToken();
  if (!token) return null;
  const cached = cachedLicense();
  if (!force && cached && Date.now() - cached.checkedAt < DAY) return cached;
  try {
    const response = await fetch(`https://api.sociobot.in/api/v1/products/${SLUG}/verify?license=${encodeURIComponent(token)}`);
    if (!response.ok) throw new Error('Verification failed');
    const data = await response.json() as { valid: boolean };
    const state = { token, valid: data.valid, checkedAt: Date.now() };
    localStorage.setItem(STATE_KEY, JSON.stringify(state));
    return state;
  } catch {
    return cached;
  }
}
