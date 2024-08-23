# BASE PROFILE
FROM node:20.15.0-alpine as base
RUN mkdir -p /opt/app
WORKDIR /opt/app
RUN adduser -S app
RUN chown -R app /opt/app
COPY package*.json ./

# DEVELOPMENT PROFILE
FROM base as development
RUN npm install && npm cache clean --force
COPY . ./
USER app
CMD ["sh"]
