FROM node:20-alpine AS base
WORKDIR /app

# Install bun for faster installs
RUN curl -fsSL https://bun.sh/install | bash && \
	ln -s /root/.bun/bin/bun /usr/local/bin/bun

COPY package.json ../../package.json ./
COPY ../../bun.lock ./bun.lock
COPY ../../packages ./packages
COPY ../../apps ./apps

RUN bun install --frozen-lockfile

WORKDIR /app/packages/backend
RUN bun run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/packages/backend/dist ./dist
COPY --from=base /app/packages/backend/package.json ./package.json

EXPOSE 4000
CMD ["node", "dist/index.js"]

