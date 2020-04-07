###########################
# Mithril
###########################
FROM node:13-alpine as build

ENV HOME=/app

COPY package.json $HOME/
COPY app $HOME/app
COPY public $HOME/public

WORKDIR $HOME

RUN npm install && \
    npm run build && \
    rm -rf node_modules

###########################
# Server
###########################
FROM node:13-alpine

ENV HOME=/app

COPY index.mjs package.json $HOME/

WORKDIR $HOME

RUN npm install --production

COPY api $HOME/api
COPY config $HOME/config
COPY --from=build /app/public $HOME/public

EXPOSE 3000

CMD ["npm", "start"]
