FROM node:20-alpine AS  build_image

WORKDIR /app

ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

COPY package.json package-lock.json ./

RUN npm install --verbose --no-audit

COPY vite.config.js ./
COPY index.html ./

COPY src ./src
COPY public ./public

RUN npm run build

# ---------------------------------------------------

FROM nginx:alpine AS  production_image

COPY --from=build_image /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]