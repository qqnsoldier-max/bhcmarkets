FROM node:20-alpine AS base
WORKDIR /app
RUN curl -fsSL https://bun.sh/install | bash && \
	ln -s /root/.bun/bin/bun /usr/local/bin/bun

COPY package.json ../../package.json ./
COPY ../../bun.lock ./bun.lock
COPY ../../packages ./packages
COPY ../../apps ./apps
RUN bun install --frozen-lockfile

WORKDIR /app/packages/worker
# Placeholder build step; adjust when worker has TS build
CMD ["node", "src/queue.ts"]

