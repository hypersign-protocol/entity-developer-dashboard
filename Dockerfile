FROM node:18 as build-stage

# RUN apt-get update && apt-get install -y git
# RUN git clone https://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@github.com/hypersign-protocol/entity-developer-dashboard.git /app

WORKDIR /app
COPY ./package.json .
RUN yarn

COPY . .
ENV VUE_APP_TITLE='__VUE_APP_TITLE__'

ENV VUE_APP_DESC='__VUE_APP_DESC__'

ENV VUE_APP_VERSION='__VUE_APP_VERSION__'

ENV VUE_APP_STUDIO_SERVER_BASE_URL='__VUE_APP_STUDIO_SERVER_BASE_URL__'

ENV VUE_APP_STUDIO_SERVER_BASE_WS='__VUE_APP_STUDIO_SERVER_BASE_WS__'

ENV VUE_APP_NODE_SERVER_BASE_URL='__VUE_APP_NODE_SERVER_BASE_URL__'

ENV VUE_APP_NODE_SERVER_BASE_URL_REST='__VUE_APP_NODE_SERVER_BASE_URL_REST__'

ENV VUE_APP_EXPLORER_BASE_URL='__VUE_APP_EXPLORER_BASE_URL__'

ENV VUE_APP_WEB_WALLET_ADDRESS='__VUE_APP_WEB_WALLET_ADDRESS__'
ENV VUE_APP_ORIGINS='__VUE_APP_ORIGINS__'


RUN yarn  build

FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
