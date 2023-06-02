FROM node:18

WORKDIR /dist

COPY . /dist

RUN npm install

EXPOSE 8080/tcp
CMD ["node", "app.js"]