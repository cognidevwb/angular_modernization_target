# Angular Modernization Target — multi-stage build, nginx static serve. Generated deterministically.
FROM node:22-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci || npm install
COPY . .
RUN npm run build

FROM nginx:1.27-alpine
COPY --from=build /app/dist/angular-modernization-target/browser /usr/share/nginx/html
EXPOSE 80
