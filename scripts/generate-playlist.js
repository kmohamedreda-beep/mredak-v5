const fs = require("fs");
const path = require("path");

const AUDIO_DIR = path.join(__dirname, "../public/audio");
const OUTPUT = path.join(__dirname, "../src/data/playlist.json");
const MAX_PER_CATEGORY = 30;

const CATEGORIES = [
  "medical",
  "corporate",
  "elearning",
  "gaming",
  "luxury",
  "documentary",
  "narration",
  "ads",
  "international",
];

const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".m4a", ".flac", ".aac"];

// ── Language detection ────────────────────────────────────────────────────────
// Order matters: most specific first (algerian_ar before ar).
function detectLanguage(filename) {
  const f = filename;

  // Algerian Arabic: DZ prefix/suffix or explicit DZX tag
  if (/\bDZX?\d*\b/i.test(f) || /[_\s-]DZ[_\s.-]/i.test(f) || /[_\s-]DZ$/i.test(f)) {
    return "algerian_ar";
  }
  // Arabic: starts with AR_, or _AR_ infix, or ARX tag, or "arabic" word
  if (
    /^AR_/i.test(f) ||
    /[_\s-]AR_/i.test(f) ||
    /[_\s-]ARX\d/i.test(f) ||
    /[_\s]AR\s*$/i.test(f) ||
    /\barabic\b/i.test(f)
  ) {
    return "ar";
  }
  // English: starts with EN_, or _EN_ infix, or ENX tag, or "english" word
  if (
    /^EN_/i.test(f) ||
    /[_\s-]EN_/i.test(f) ||
    /[_\s-]ENX\d/i.test(f) ||
    /[_\s]EN\s*$/i.test(f) ||
    /\benglish\b/i.test(f)
  ) {
    return "en";
  }
  // French (default — majority of portfolio is French)
  return "fr";
}

// ── Name cleaning ─────────────────────────────────────────────────────────────
function cleanName(filename) {
  let name = path.basename(filename, path.extname(filename));
  // Strip language+type prefix: FR_General_, EN_E-Learning_, AR_General_…
  name = name.replace(/^(FR|EN|AR|DZ)_[A-Za-z-]+_/i, "");
  // Strip trailing version tags: FRX03, X02, ARX02, DZX03
  name = name.replace(/[\s_]*(FR|EN|AR|DZ)?X\d+\s*$/i, "");
  // Strip trailing _Reda / -Reda
  name = name.replace(/[\s_-]+[Rr]eda\s*$/, "");
  // Replace underscores/hyphens with spaces
  name = name.replace(/[_-]+/g, " ");
  // Collapse extra spaces
  name = name.replace(/\s+/g, " ").trim();
  return name || path.basename(filename, path.extname(filename));
}

// ── Build flat playlist array ─────────────────────────────────────────────────
const tracks = [];
let idCounter = 0;

for (const category of CATEGORIES) {
  const dir = path.join(AUDIO_DIR, category);

  if (!fs.existsSync(dir)) continue;

  const files = fs
    .readdirSync(dir)
    .filter((f) => AUDIO_EXTENSIONS.includes(path.extname(f).toLowerCase()))
    .sort()
    .slice(0, MAX_PER_CATEGORY);

  for (const file of files) {
    tracks.push({
      id: `track-${idCounter++}`,
      name: cleanName(file),
      path: `/audio/${category}/${encodeURIComponent(file)}`,
      category,
      language: detectLanguage(file),
    });
  }
}

// ── Write output ──────────────────────────────────────────────────────────────
fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify(tracks, null, 2));

// ── Summary ───────────────────────────────────────────────────────────────────
console.log(`✓ ${tracks.length} pistes générées\n`);

const byCategory = {};
const byLanguage = {};
for (const t of tracks) {
  byCategory[t.category] = (byCategory[t.category] || 0) + 1;
  byLanguage[t.language] = (byLanguage[t.language] || 0) + 1;
}

console.log("Par catégorie :");
for (const [cat, n] of Object.entries(byCategory)) {
  console.log(`  ${cat.padEnd(14)} ${n}`);
}
console.log("\nPar langue :");
const langLabels = { fr: "Français", ar: "Arabe", en: "Anglais", algerian_ar: "Darija (DZ)" };
for (const [lang, n] of Object.entries(byLanguage)) {
  console.log(`  ${(langLabels[lang] || lang).padEnd(14)} ${n}`);
}
