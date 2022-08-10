SERVER_SOURCE:=$(shell find server/src -name '*.ts' -type f)
CLIENT_SOURCE:=$(shell find client/src -name '*.ts' -type f)
CLIENT_MARKUP:=$(shell find client -name '*.html' -type f)
CLIENT_STYLE:=$(shell find client/scss -name '*.scss' -type f)

all: dist/.dirstamp

dist/.dirstamp: dist/node_modules dist/server.js $(CLIENT_SOURCE) $(CLIENT_MARKUP) $(CLIENT_STYLE) client/node_modules
	cd client && tsc --noEmit && pnpm vite build
	touch $@

dist/node_modules: server/node_modules
	mkdir -p dist
	ln -sf $$(pwd)/$< $$(pwd)/$@

dist/%.js: $(SERVER_SOURCE) server/tsconfig.json
	tsc server/src/server.ts --outdir dist

%/node_modules: %/pnpm-lock.yaml
	cd $(@D) && pnpm install --frozen-lockfile

run: dist/.dirstamp
	node dist/server.js

clean:
	rm -rf dist client/node_modules server/node_modules

.PHONY: test run clean all
