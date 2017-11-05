FROM node:slim

ENV HOME=/app

COPY package.json $HOME/

WORKDIR $HOME

RUN npm install

COPY . $HOME/

EXPOSE 4011

CMD ["npm", "start"]
