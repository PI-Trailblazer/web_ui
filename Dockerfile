FROM node:lts

WORKDIR /web_ui

COPY package.json yarn.lock ./

RUN yarn install --silent

COPY . .

EXPOSE 3000

CMD yarn run dev 