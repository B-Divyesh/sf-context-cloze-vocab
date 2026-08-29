import assert from 'node:assert/strict';

const site = new URL(process.env.LIVE_URL || 'https://context-cloze-vocab.sociobot.in');
const billing = new URL('https://api.sociobot.in/api/v1/products/context-cloze-vocab');

async function get(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', ...options });
  return response;
}

const home = await get(site);
assert.equal(home.status, 200, `Expected ${site} to return 200, got ${home.status}`);
const homeHtml = await home.text();
assert.match(homeHtml, /<title>Context Cloze — practise words in sentences<\/title>/);

const missing = await get(new URL('/release-check-missing-page', site));
assert.equal(missing.status, 404, `Expected an unknown route to return 404, got ${missing.status}`);
const missingHtml = await missing.text();
assert.match(missingHtml, /<h1>Page not found<\/h1>/);

const checkout = await get(new URL('./checkout', `${billing}/`));
assert.equal(checkout.status, 303, `Expected hosted checkout redirect, got ${checkout.status}`);
const checkoutLocation = checkout.headers.get('location') || '';
assert.match(checkoutLocation, /^https:\/\/checkout\.dodopayments\.com\/session\//, 'Checkout did not redirect to a hosted Dodo session');

const verification = await get(new URL('./verify?license=release-check-invalid-token', `${billing}/`));
assert.equal(verification.status, 200, `Expected license verification response, got ${verification.status}`);
const result = await verification.json();
assert.equal(result.valid, false, 'An invalid release-check token must not activate a license');

console.log(JSON.stringify({
  site: site.href,
  home: home.status,
  notFound: missing.status,
  checkout: checkout.status,
  checkoutHost: new URL(checkoutLocation).host,
  invalidLicenseValid: result.valid
}, null, 2));
