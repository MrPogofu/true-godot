// Prints every token in a sample with its TextMate scope stack and resolved colour.
// Usage: node scopes.mjs <sample file> [lang]
import { createHighlighter } from "shiki";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { langFor, langsToLoad, loadThemes } from "./langs.mjs";

const [file, langArg] = process.argv.slice(2);
const lang = langArg ?? langFor(file);
const [theme] = loadThemes(path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.."));
const h = await createHighlighter({ themes: [theme], langs: langsToLoad([lang]) });
const code = fs.readFileSync(file, "utf8").replace(/\r\n/g, "\n");
const { tokens } = h.codeToTokens(code, { lang, theme: theme.name, includeExplanation: true });
for (const line of tokens) for (const t of line) for (const e of t.explanation ?? []) {
  if (!e.content.trim()) continue;
  console.log(`${t.color}\t${JSON.stringify(e.content)}\t${e.scopes.slice(1).map((s) => s.scopeName).join(" ")}`);
}
