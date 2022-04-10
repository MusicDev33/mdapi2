FROM node:16
WORKDIR ~/app/mdapi2

COPY package*.json ./

RUN npm run setup

COPY . .

EXPOSE 3000
CMD ["ts-node", "src/index.ts"]
