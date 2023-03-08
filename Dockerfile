FROM node:19.4.0

WORKDIR /app

COPY . /app

RUN npm install -g pnpm && pnpm install --prod

CMD ["pnpm", "run", "start"]
