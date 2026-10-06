// Renders every file in ../samples with the True Godot theme using Shiki
// (the same TextMate grammars + scope matching VS Code uses) and writes:
//   out/gallery.html  - visual preview of every language (hover a token to see its scopes)
//   out/report.txt    - tokens that no theme rule matched, grouped by language
import { createHighlighter } from "shiki";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { langFor, langsToLoad, loadThemes } from "./langs.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const samplesDir = path.join(root, "test/samples");
const outDir = path.join(here, "out");
fs.mkdirSync(outDir, { recursive: true });

const themes = loadThemes(root);

// Godot files first, then everything else alphabetically.
const godotFirst = (f) => (/^gd/.test(f) ? "0" : "1") + f.toLowerCase();
const files = fs.readdirSync(samplesDir)
  .sort((a, b) => godotFirst(a).localeCompare(godotFirst(b)))
  .map((file) => ({ file, lang: langFor(file) }))
  .filter((f) => f.lang);

const highlighter = await createHighlighter({
  themes,
  langs: langsToLoad(files.map((f) => f.lang)),
});

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const report = [];
const variety = [];
let html = "";

for (const theme of themes) {
  const bg = theme.colors["editor.background"];
  const fg = theme.colors["editor.foreground"];
  const lineNo = theme.colors["editorLineNumber.foreground"];
  html += `<h1>${esc(theme.name)}</h1><div class="grid">`;
  for (const { file, lang } of files) {
    const code = fs.readFileSync(path.join(samplesDir, file), "utf8").replace(/\r\n/g, "\n").trimEnd();
    const { tokens } = highlighter.codeToTokens(code, { lang, theme: theme.name, includeExplanation: true });
    let body = "";
    const chars = {};
    tokens.forEach((line, i) => {
      body += `<span class="ln" style="color:${lineNo}">${i + 1}</span>`;
      for (const t of line) {
        const scopes = (t.explanation ?? []).map((e) => e.scopes.map((s) => s.scopeName).join(" ")).join(" | ");
        const style = `color:${t.color}${t.fontStyle & 1 ? ";font-style:italic" : ""}${t.fontStyle & 2 ? ";font-weight:bold" : ""}${t.fontStyle & 4 ? ";text-decoration:underline" : ""}`;
        if (theme === themes[0] && t.content.trim()) chars[t.color.toUpperCase()] = (chars[t.color.toUpperCase()] ?? 0) + t.content.replace(/s/g, "").length;
        body += `<span style="${style}" title="${esc(scopes)}">${esc(t.content)}</span>`;
        // Report tokens with meaningful text that fell through to the default foreground.
        if (theme === themes[0]) {
          for (const e of t.explanation ?? []) {
            const matched = e.scopes.some((s) => s.themeMatches?.length);
            if (!matched && /\w/.test(e.content)) {
              const inner = e.scopes.at(-1)?.scopeName;
              if (inner && !/^(source|text)\.[\w.-]+$/.test(inner)) report.push(`${file}\t${e.content.trim()}\t${inner}`);
            }
          }
        }
      }
      body += "\n";
    });
    if (theme === themes[0]) variety.push({ file, chars });
    html += `<section data-file="${esc(file)}"><h2>${esc(file)} <small>${lang}</small></h2><pre style="background:${bg};color:${fg}">${body}</pre></section>`;
  }
  html += "</div>";
}

fs.writeFileSync(path.join(outDir, "gallery.html"), `<!doctype html><meta charset="utf-8"><title>True Godot gallery</title>
<style>
body{background:#000;color:#cdcfd2;font-family:system-ui,sans-serif;margin:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(640px,1fr));gap:16px}
h2{font-size:14px;margin:0 0 4px;background:#363d4a;padding:6px 10px;border-radius:3px 3px 0 0}
h2 small{opacity:.6;font-weight:normal}
pre{margin:0;padding:10px;font:13px/1.5 "JetBrains Mono",Consolas,monospace;overflow:auto;tab-size:4}
.ln{display:inline-block;width:2.5em;text-align:right;margin-right:1.2em;user-select:none}
.solo .grid{grid-template-columns:1fr}.solo pre{font-size:16px}
.compare{display:grid;grid-template-columns:1fr 1fr;gap:16px;align-items:start}.compare img{width:100%}
</style>
<script>
// ?f=<file> shows only that sample; ?compare shows the GDScript sample next to the real Godot editor.
const q = new URLSearchParams(location.search);
addEventListener("DOMContentLoaded", () => {
  const f = q.get("f") ?? (q.has("compare") ? "gdscript.gd" : null);
  if (!f) return;
  document.body.classList.add("solo");
  document.querySelectorAll("section").forEach((s) => { if (!s.dataset.file.includes(f)) s.remove(); });
  if (q.has("compare")) {
    const wrap = document.createElement("div");
    wrap.className = "compare";
    wrap.innerHTML = '<img src="../../reference/godot-4.4-script-editor.png">';
    const sec = document.querySelector("section");
    sec.replaceWith(wrap);
    wrap.prepend(sec);
  }
});
</script>${html}`);
const unique = [...new Set(report)];
fs.writeFileSync(path.join(outDir, "report.txt"), unique.join("\n") + "\n");
// Colour variety: how much of each sample is blue / red / plain text versus everything else.
const family = (c) => ({ "#ABC9FF": "blue", "#BCE0FF": "blue", "#57B3FF": "blue", "#66E6FF": "blue", "#FF7085": "red", "#FF8CCC": "red", "#CDCFD2": "text" })[c] ?? "other";
const rows = variety.map(({ file, chars }) => {
  const total = Object.values(chars).reduce((a, b) => a + b, 0) || 1;
  const f = { blue: 0, red: 0, text: 0, other: 0 };
  for (const [c, n] of Object.entries(chars)) f[family(c)] += n;
  return { file, colours: Object.keys(chars).length, ...Object.fromEntries(Object.entries(f).map(([k, v]) => [k, Math.round((100 * v) / total)])) };
}).sort((a, b) => a.other - b.other);
const tsv = (cells) => cells.join("\t");
const table = [tsv(["file", "colours", "blue%", "red%", "text%", "other%"]), ...rows.map((r) => tsv([r.file, r.colours, r.blue, r.red, r.text, r.other]))];
fs.writeFileSync(path.join(outDir, "variety.txt"), table.join("\n") + "\n");
console.log(`Rendered ${files.length} samples x ${themes.length} theme(s); ${unique.length} unstyled tokens -> out/report.txt`);
