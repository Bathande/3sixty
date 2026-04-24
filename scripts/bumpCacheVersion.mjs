/**
 * bumpCacheVersion.mjs
 * Runs automatically before every `npm run build` via the "prebuild" script.
 * Updates CACHE_VERSION in src/hooks/useProducts.js to the current
 * date + build count so all users get fresh data after each deployment.
 */

import { readFileSync, writeFileSync } from 'fs';

const FILE = 'src/hooks/useProducts.js';
const content = readFileSync(FILE, 'utf8');

// Build a new version string: YYYY-MM-DD.timestamp
const now = new Date();
const date = now.toISOString().slice(0, 10); // e.g. 2026-04-25
const ts   = Date.now();                      // unique per build
const newVersion = `${date}.${ts}`;

// Replace the CACHE_VERSION line
const updated = content.replace(
  /const CACHE_VERSION = '[^']*';/,
  `const CACHE_VERSION = '${newVersion}';`
);

if (updated === content) {
  console.log('[prebuild] CACHE_VERSION line not found — skipping.');
} else {
  writeFileSync(FILE, updated, 'utf8');
  console.log(`[prebuild] Cache version bumped → ${newVersion}`);
}

