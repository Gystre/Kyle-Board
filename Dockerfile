FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# copy this stuff first to cache it THEN copy everything else. docker will install anything that has changed
COPY package.json .
COPY yarn.lock .

COPY server/package.json server/package.json
COPY common/package.json common/package.json

RUN yarn --pure-lockfile --non-interactive

# copy all the files before building them
COPY server server
COPY common common

# production environment vars -> .env
# set inside heroku config vars
# COPY server/.env .env 
COPY server/.env.example .env.example

# replace ormconfig.json with docker specific vars
COPY server/ormconfig.docker.json server/ormconfig.json

RUN yarn build:common
RUN yarn build:server
# argon2 v0.28+ requires GLIBC_2.25 but docker doesn't have that installed
# internet says to do this but fails compile for some reason i dunno lol
# RUN npm rebuild argon2 --build-from-source

# set env var NODE_ENV = production
ENV NODE_ENV production

EXPOSE 8080
CMD [ "node", "server/dist/index.js" ]

# set the user to use when running this image
USER node