FROM node:20-alpine as builder

RUN npm i -g pnpm
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY . .
RUN pnpm i --force && pnpm rebuild && pnpm build
RUN rm -rf node_modules && npm pkg delete scripts.prepare && pnpm i --prod

FROM node:20-alpine as bot

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
ENTRYPOINT [ "npm", "run" ]
CMD [ "start" ]
