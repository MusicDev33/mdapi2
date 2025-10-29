# The point of this file is the minimize the ever-loving hell out of the
# Docker container size. I'm on a quest to minimize the size of MDAPI,
# and I think this is as small as it gets for TypeScript.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci --omit=dev && npm audit fix
COPY . .
RUN npm run build && npm prune --production

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY .env ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3010
CMD ["dist/index.js"]