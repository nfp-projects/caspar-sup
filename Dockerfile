###########################
# Mithril
###########################
FROM node:13-alpine as build

ENV HOME=/app

COPY package.json $HOME/
COPY app $HOME/app
COPY public $HOME/public

WORKDIR $HOME

RUN apk add --no-cache make gcc g++ python && \
    npm install && \
    apk del make gcc g++ python && \
    npm run build

###########################
# Server
###########################
FROM node:13-alpine

ENV HOME=/app

COPY .babelrc config.js log.js index.js package.json $HOME/

WORKDIR $HOME

RUN apk add --no-cache make gcc g++ python && \
    npm install --production

COPY api $HOME/api
COPY migrations $HOME/migrations
COPY config $HOME/config
COPY script $HOME/script
COPY --from=build /app/public $HOME/public

EXPOSE 3000

CMD ["npm", "start"]
