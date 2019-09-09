FROM node:11 as builder

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# copy dependency configuration and run commands
COPY package.json ./
COPY webpack.config.js ./
COPY .eslintrc ./
COPY ./src ./src
RUN npm install
RUN npm run build

# The instructions for second stage
FROM node:11-alpine

ARG PORT=8080
ENV PORT=${PORT}

WORKDIR /usr/src/app
COPY package.json ./
RUN npm install --production
COPY --from=builder /code/build ./build
COPY ./src ./src

EXPOSE ${PORT}

# run build and start
CMD [ "npm", "run", "start" ]