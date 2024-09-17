FROM node:20

WORKDIR /prompt-injection-fe/

COPY public/ /prompt-injection-fe/public
COPY src/ /prompt-injection-fe/src
COPY package.json /prompt-injection-fe/

RUN npm install

CMD ["npm", "start"]