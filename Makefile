SERVER_SOURCE:=$(shell find server/src -name '*.ts' -type f)
CLIENT_SOURCE:=$(shell find client/src -name '*.ts' -type f)
CLIENT_MARKUP:=$(shell find client -name '*.html' -type f)

dist/.dirstamp: dist/node_modules dist/server.js $(CLIENT_SOURCE) $(CLIENT_MARKUP)
	cd client && pnpm vite build
	touch $@

dist/node_modules: server/node_modules client/node_modules
	ln -sf $$(pwd)/$^ $$(pwd)/$@

dist/%.js: $(SERVER_SOURCE) server/tsconfig.json
	tsc server/src/server.ts --outdir dist

server/node_modules: server/pnpm-lock.yaml
	cd server && pnpm install --frozen-lockfile

client/node_modules: client/pnpm-lock.yaml
	cd client && pnpm install --frozen-lockfile

run: dist/.dirstamp
	node dist/server.js

.PHONY: test run
