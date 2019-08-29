FROM node:11

# Create app directory
RUN mkdir -p /code
WORKDIR /code

# copy dependency configuration and run commands
COPY package.json /code/
# install dependencies
RUN npm install

# copy build configuration
COPY webpack.config.js /code/

# copy static code analysis configuration
COPY .eslintrc /code/

# copy application source code
COPY ./src /code/src

EXPOSE 3002

# run build and start
CMD [ "npm", "start" ]