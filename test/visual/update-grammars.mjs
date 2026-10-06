// Downloads the latest Godot grammars from the official godot-tools VS Code extension.
import fs from "node:fs";

const base = "https://raw.githubusercontent.com/godotengine/godot-vscode-plugin/master/syntaxes/";
for (const name of ["GDScript", "GDShader", "GDResource"]) {
  const res = await fetch(`${base}${name}.tmLanguage.json`);
  if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
  fs.writeFileSync(new URL(`grammars/${name}.tmLanguage.json`, import.meta.url), await res.text());
  console.log(`Updated ${name}`);
}
