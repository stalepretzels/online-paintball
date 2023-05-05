FROM node:18

WORKDIR /dist

COPY . /dist

RUN npm install

EXPOSE 6942/tcp
CMD ["node", "app.js"]