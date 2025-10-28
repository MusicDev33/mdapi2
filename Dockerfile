# The point of this file is the minimize the ever-loving hell out of the 
# Docker container size. I'm on a quest to minimize the size of MDAPI,
# and I think this is as small as it gets for TypeScript.

FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json .env ./
RUN npm ci --omit=dev && npm audit fix && npm cache clean --force
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
