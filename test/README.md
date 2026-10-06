# Visual tests

## In VS Code

Press **F5** in this repo. An Extension Development Host opens `test/samples` with the theme loaded.
Edits to the theme file apply live. Use **Developer: Inspect Editor Tokens and Scopes** to see why a token has its colour.

GDScript, `.gdshader` and `.tscn` samples need the [godot-tools](https://marketplace.visualstudio.com/items?itemName=geequlim.godot-tools) extension installed in that window.

## Gallery

`test/visual` renders every sample with [Shiki](https://shiki.style), which uses the same TextMate grammars and scope matching as VS Code:

```bash
cd test/visual
npm install
npm run render
```

* `out/gallery.html` shows every language. Hover a token to see its scopes. Add `?f=python` to show one file, or `?compare` to put the GDScript sample next to the real Godot editor.
* `out/report.txt` lists tokens that no theme rule matched.
* `npm run scopes -- ../samples/gdscript.gd` prints each token's scopes and final colour.
* `npm run update-grammars` downloads the latest Godot grammars from godot-tools.
* `npm run update-globals` regenerates `syntaxes/gdscript-globals.injection.json`, the list of Godot global functions (`print`, `clamp`...) shown in purple.

The gallery page loads files relative to `test/`, so serve that folder (for example `python -m http.server --directory test`) and open `/visual/out/gallery.html`.

## Reference

`reference/godot-4.4-script-editor.png` is the real Godot 4.4.1 script editor with default settings, showing `samples/gdscript.gd`.
The colours in the theme come from Godot's `editor_settings.cpp`, `editor_theme_manager.cpp`, `gdscript_highlighter.cpp` and `text_shader_editor.cpp`.
