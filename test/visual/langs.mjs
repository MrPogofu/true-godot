// Shared language setup for the visual tests.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));

// Godot grammars come from the official godot-tools extension (godotengine/godot-vscode-plugin)
// rather than Shiki's bundled copies, so the tests match what Godot users see in VS Code.
// Refresh them with: npm run update-grammars
const godot = (file, name, extra = {}) => ({
  ...JSON.parse(fs.readFileSync(path.join(here, "grammars", file), "utf8")),
  name,
  ...extra,
});

// The theme's own injection grammar (colours Godot global functions such as print()).
const globalsInjection = {
  ...JSON.parse(fs.readFileSync(path.join(here, "../../syntaxes/gdscript-globals.injection.json"), "utf8")),
  name: "gdscript-globals",
  injectTo: ["source.gdscript"],
};

export const customLangs = [
  godot("GDScript.tmLanguage.json", "gdscript"),
  globalsInjection,
  godot("GDShader.tmLanguage.json", "gdshader"),
  godot("GDResource.tmLanguage.json", "gdresource", { embeddedLangs: ["gdscript"] }),
];

export const extToLang = {
  gd: "gdscript", gdshader: "gdshader", tscn: "gdresource", tres: "gdresource", cs: "csharp", py: "python",
  js: "javascript", ts: "typescript", tsx: "tsx", json: "json", jsonc: "jsonc",
  html: "html", css: "css", scss: "scss", md: "markdown", yaml: "yaml", toml: "toml",
  xml: "xml", sql: "sql", c: "c", cpp: "cpp", rs: "rust", go: "go", java: "java",
  kt: "kotlin", swift: "swift", php: "php", rb: "ruby", lua: "lua", sh: "shellscript",
  ps1: "powershell", ini: "ini", glsl: "glsl", hlsl: "hlsl", dart: "dart", zig: "zig",
  hs: "haskell", vue: "vue", diff: "diff", bat: "bat", r: "r", tex: "latex",
};
const nameToLang = { Dockerfile: "dockerfile", Makefile: "makefile" };

export const langFor = (file) => nameToLang[path.basename(file)] ?? extToLang[path.extname(file).slice(1)];

// Built-in languages to load (custom ones are passed as grammar objects).
export function langsToLoad(langs) {
  const custom = new Set(customLangs.map((l) => l.name));
  return [...customLangs, ...[...new Set(langs)].filter((l) => !custom.has(l))];
}

// VS Code theme files are JSONC: allow comments and trailing commas.
export function readJsonc(file) {
  const text = fs.readFileSync(file, "utf8")
    .replace(/\/\*[\s\S]*?\*\/|("(?:\\.|[^"\\])*")|\/\/[^\n]*/g, (m, str) => str ?? "")
    .replace(/,(\s*[}\]])/g, "$1");
  return JSON.parse(text);
}

// Loads every theme contributed by the extension's package.json.
export function loadThemes(root) {
  const manifest = readJsonc(path.join(root, "package.json"));
  return manifest.contributes.themes.map((t) => ({
    ...readJsonc(path.join(root, t.path)),
    name: t.label,
    type: t.uiTheme === "vs" ? "light" : "dark",
  }));
}
