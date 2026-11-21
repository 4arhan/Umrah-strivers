# Checking a translated batch

You did not write this translation. Your job is to find what is wrong with it before a pilgrim relies on it.
Assume there are mistakes: a careful translator still makes them.

Read `i18n/src/BRIEF.md` first; every rule there applies. Then, for the batch you were given:

1. Read the English (`i18n/src/chunks/<batch>.json`), the translation (`i18n/tr/<lang>/<batch>.json`), the term
   sheet (`i18n/tr/<lang>/_terms.json`) and the sources (`node tools/i18n-build.js refs <batch> <lang>`).
2. Go through **every** line. For each one, translate the translation back in your head and compare it with the
   English. Look for:
   - **Meaning**: anything added, left out, or changed. A ruling made stronger or weaker. A lost "not", "only",
     "unless", "before/after", "men/women", "must/should/may". The wrong rite, place or day.
   - **Sources** (lines with `refs`): read the line against the **Arabic** text of the hadith or verse, not only the
     English. A verse must use the published translation shown, not a fresh rendering. If the translation says more
     or less than the Arabic, fix it. If the **English line itself** claims something the cited text does not say
     (wrong narration, wrong number of times, a detail that is not in the text, the wrong collection), do not
     "correct" it in translation: keep the translation faithful to the English and report it under `source_issues`,
     quoting the Arabic words that matter.
   - **Terms**: the term sheet is followed; the same thing is called the same name throughout.
   - **Language**: grammar, spelling, agreement, natural word order; nothing that reads as machine-made; labels and
     buttons short; right direction of quotation marks and punctuation for the language.
   - **Marks**: placeholders in a position that reads correctly once a number or name is filled in; plural forms
     correct for the language.
3. Fix what you find **in the translation file** (edit only the lines that need it). Do not rewrite lines that are
   already right just to make them yours.
4. Run `node tools/i18n-build.js check <lang> <batch>` until it prints `"ok": true`.
5. Report: how many lines you changed, the three most serious corrections (id, what was wrong), and every
   `source_issues` entry.

If you are not sure a line is right and cannot settle it from the sources, say so in the report under `unsure`
rather than guessing. A line listed as unsure is looked at again; a silent guess is not.
