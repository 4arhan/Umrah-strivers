# Translating Miqah

Miqah is a free, offline Hajj and Umrah companion. A pilgrim reads it on a phone in the Haram, often tired, often
in a crowd. The translation has to be something they can trust and act on: clear, plain, correct.

The app stays in English inside. `i18n.js` translates what is on the screen by looking each line up in a language
pack. You translate the lines; `tools/i18n-build.js` checks them and builds the pack.

## What a batch looks like

`i18n/src/chunks/<batch>.json` is a list of lines:

```json
{ "h": "1x8k2p", "k": "Day {1} of {2} · <1>Tawaf</1> next", "c": "#heroCard", "refs": ["bukhari:1773"] }
```

- `h` is the line's id. `k` is the English. `c` says where it appears (an element id, a class, a data list such as
  `KNOW.t`, or `@aria-label` for text a screen reader speaks). `refs` lists the hadith or verses the line cites.
- `part_of`, when present, shows a longer line this one is a piece of (`Makkah · day {1} · rest`). The app joins the
  pieces with ` · `, so translate the piece so that it reads correctly on its own and inside that line.
- Write your translations to `i18n/tr/<lang>/<batch>.json` as one object: `{ "1x8k2p": "…", … }`, one entry for
  **every** `h` in the batch.

## What must come through unchanged

The checker refuses a line that breaks any of these, and the line then stays in English.

| In the English | Meaning | Rule |
|---|---|---|
| `{1}` `{2}` … | a number the app fills in (a count, a time, a hadith number, a phone number) | Keep each one exactly once. Move it where the grammar needs it. Never write a number in its place. |
| `{D1}` `{d1}` | a weekday, long or short | Keep. The app fills in the name in your language. |
| `{M1}` `{m1}` `{H1}` | a month, long or short; a Hijri month | Keep. These only appear beside a day number. |
| `{P1}` | one of the five prayers | Keep. |
| `{U1}` | the pilgrim's own words (their name, hotel, a medicine) | Keep. Never translate or transliterate around it as if you knew it. |
| `<1>…</1>` | bold, a link, or emphasis around part of the line | Keep the pair, around the matching words. Pairs must nest properly. |
| `→ ↔ ↗ ✓ ✕ ▶ ◀ ▾ ▴ ↻ ⛶ ＋` | an arrow, a tick, a chevron | Keep each one. `Plan▶Prepare` is a path through the app: translate the names, keep the mark. In a right-to-left language keep the same mark; the app mirrors it. |
| `ﷺ` | | Keep it wherever the English has it. Do not add it where the English does not. |
| `nusuk.sa`, `miqah.app`, any web address | | Keep exactly. |
| Latin transliteration of Arabic (`Labbayk Allahumma labbayk`) | how to say it | Keep as written, unless your script has its own established way to write the Arabic sounds and the term sheet says to use it. |

A line may need a different form depending on the number in `{1}` (1 day, 2 days, 5 days). Then, and only then, give
an object with the plural forms your language has in CLDR: `{"one": "…", "other": "…"}` (Arabic: `zero one two few
many other`; Russian: `one few many other`; languages without plural forms: write a plain string). The `one` and
`two` forms may spell the number out and leave `{1}` out; every other placeholder must still be there.

## The words

1. **Follow the term sheet** at `i18n/tr/<lang>/_terms.json`. It fixes how this language writes the rites and the
   app's own names (Ihram, Tawaf, Sa'i, the tabs). If a term you need is missing, use what Muslims who speak the
   language actually say, and list it in your report so it can be added.
2. **Allah stays Allah.** Not a local word for "God", unless the term sheet says the Muslim community uses it.
3. **Rulings keep their weight.** "Must", "is obligatory", "is recommended", "is disliked", "most scholars say",
   "the Hanafi school says" each mean something different. Translate the weight exactly. Do not strengthen, soften,
   add a ruling, or drop a qualifier such as "if you are able" or "according to the majority".
4. **Do not add and do not leave out.** No explanations, no extra honorifics, no "peace be upon him" written out
   where the English has nothing. If the English is ambiguous, keep the ambiguity or pick the reading the context
   (`c`) supports.
5. **Plain and short.** Buttons and labels are a word or two; keep them that short. Speak to the reader the way the
   term sheet says (formal or informal "you").
6. **Names of people and places** follow the form your language already uses for them (Aisha, Ibn Umar, Madinah).
7. **Numbers are always `{n}` placeholders**, so you never type a digit. If you find yourself typing one, stop.

## Quran and hadith

Miqah never puts its own translation of a verse into a pilgrim's hands.

- Run `node tools/i18n-build.js refs <batch> <lang>` to see, for each `refs` entry, the Arabic text, the published
  English, and for verses a **published translation in your language** with its translator's name.
- **A verse quoted in the line**: use the wording of the published translation shown (you may shorten to the part
  the English quotes). Do not translate the English rendering of a verse yourself.
- **A hadith quoted or summarised in the line**: the English is the app's own wording, and the app says so. Translate
  the app's wording, then read it against the **Arabic** text. If your translation says something the Arabic does not,
  fix the translation. If the *English itself* says something the Arabic does not support, translate the English
  faithfully anyway and report the line under `source_issues`.
- **A reference with no text available** (`note` instead of text): translate the line as it is; do not invent the
  wording of a source you cannot see.
- A reference such as `(Muslim {1})` stays in the line with its placeholder. Write the collection's name the way your
  language does (the term sheet has them).

## Finishing a batch

Run `node tools/i18n-build.js check <lang> <batch>`. Fix every line under `missing`, `extra` and `refused`, and run
it again until it prints `"ok": true`. A batch is not finished until it does.
