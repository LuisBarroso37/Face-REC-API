FROM node:12.18.3

# Create app directory
RUN mkdir -p /usr/src/face-rec-api
WORKDIR /usr/src/face-rec-api

# Install app dependencies
COPY package.json /usr/src/face-rec-api
RUN npm install

# Bundle app source
COPY . /usr/src/face-rec-api

# Build arguments
ARG NODE_VERSION=12.18.3

# Environment
ENV NODE_VERSION $NODE_VERSION