SERVER_SOURCE:=$(shell find server/src -name '*.ts' -type f)

dist/.dirstamp: dist/node_modules dist/server.js
	touch $@

dist/node_modules: server/node_modules
	ln -sf $$(pwd)/$^ $$(pwd)/$@

dist/%.js: $(SERVER_SOURCE) server/tsconfig.json
	tsc server/src/server.ts --outdir dist

server/node_modules: server/pnpm-lock.yaml
	cd server && pnpm install --frozen-lockfile

run: dist/.dirstamp
	node dist/server.js

.PHONY: test run
