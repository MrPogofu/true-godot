# Build targets
VERSION ?= 0.5.0
SOURCES := $(wildcard themes/*.json)

.PHONY: all package clean

all: package

package: $(SOURCES)
	@echo "Packaging $(VERSION)"
	npx @vscode/vsce package -o dist/true-godot-$(VERSION).vsix

%.min.json: %.json
	node minify.js $< > $@

clean:
	rm -rf dist/
