SERVER_SOURCE:=$(shell find server/src -name '*.ts' -type f)
CLIENT_SOURCE:=$(shell find client/src -name '*.ts' -type f)
CLIENT_MARKUP:=$(shell find client -name '*.html' -type f)
CLIENT_STYLE:=$(shell find client/scss -name '*.scss' -type f)

all: dist/.dirstamp

dist/.dirstamp: dist/node_modules dist/server.js $(CLIENT_SOURCE) $(CLIENT_MARKUP) $(CLIENT_STYLE) client/node_modules
	cd client && ./node_modules/.bin/tsc --noEmit && ./node_modules/.bin/vite build
	touch $@

dist/node_modules: server/node_modules
	mkdir -p dist
	ln -sf $$(pwd)/$< $$(pwd)/$@

dist/%.js: $(SERVER_SOURCE) server/tsconfig.json
	cd server && ./node_modules/.bin/tsc src/server.ts --outdir ../dist

server/node_modules: server/pnpm-lock.yaml
	cd $(@D) && pnpm install --frozen-lockfile

client/node_modules: client/pnpm-lock.yaml
	cd $(@D) && pnpm install --frozen-lockfile

run: dist/.dirstamp
	node dist/server.js

dev: dist/.dirstamp
	SERVER_PORT=3000 DB_PATH="$$(mktemp).db" node dist/server.js

clean:
	rm -rf dist client/node_modules server/node_modules

test:
	./test

.PHONY: test run dev clean all test
