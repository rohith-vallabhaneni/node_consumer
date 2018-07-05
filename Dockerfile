from node:latest
ADD index.js .
ADD package.json .
ADD consumer.js .
ADD test test/
WORKDIR .
RUN rm -rf nodemodules
RUN npm install
CMD npm start
