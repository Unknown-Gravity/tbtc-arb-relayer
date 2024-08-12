FROM node:20-alpine3.16 as development 

WORKDIR /usr/app

RUN apk add --no-cache git
RUN git config --global url."https://".insteadOf git://

COPY package*.json .

RUN yarn

COPY . .

RUN yarn run build

FROM node:20-alpine3.16 as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app


COPY package*.json .

RUN npm install --only=production

COPY --from=development /usr/app/dist ./dist

CMD ["node", "dist/index.js"]


