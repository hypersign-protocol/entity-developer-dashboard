FROM node:14 as build-stage

# RUN apt-get update && apt-get install -y git
# RUN git clone https://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@github.com/hypersign-protocol/entity-developer-dashboard.git /app

WORKDIR /app
COPY ./package.json .
RUN yarn

COPY . .



RUN yarn  build

FROM nginx:latest as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
