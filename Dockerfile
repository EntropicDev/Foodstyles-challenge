FROM node

WORKDIR /src

COPY package.json .

RUN npm install

RUN rm -f .npmrc

COPY . .

EXPOSE 8001

CMD ["npm", "start"]