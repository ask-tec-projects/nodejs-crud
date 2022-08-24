FROM node:18-bullseye AS builder

RUN apt-get update && apt-get install -y --no-install-recommends make sqlite3
RUN npm install -g pnpm

WORKDIR /usr/build
COPY Makefile ./Makefile
COPY server ./server
COPY client ./client
RUN make clean && \
    make dist/.dirstamp && \
    rm -rf dist/node_modules && \
    mv server/node_modules dist/node_modules

FROM node:18-bullseye AS production

WORKDIR /usr/app
COPY --from=builder /usr/build/dist /usr/app/dist
WORKDIR /usr/app/dist

EXPOSE 3000
ENTRYPOINT [ "node", "server.js" ]
