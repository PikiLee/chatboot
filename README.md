A self-host chatGpt bot.
Every post that @ the bot would get a reply from chatgpt.

+ Now only support Weibo

# Screenshot
![Screenshot](./assets/screenshot1.png)

# Usage
## pnpm
+ Create a `.env` file in project root directory to set enviornment variables.
```
// install dependency
pnpm install

// build app
pnpm run build

// start app
pnpm run start
```

## Docker
```
docker run 
    -v ./.env:/app.env 
    -e OPENAI_API_KEY=YOUR_KEY
    -e WEIBO_COOKIE=YOUR_COOKIE
    -e WEIBO_XSRF_TOKEN=YOUR_XSRF_TOKEN
    -e BASE_TIME_TO_WAIT=10000
    -e MAX_TIME_TO_WAIT=180000
    pikilee/chatboot:latest
```

## Docker compose
+ You can find `docker-compse.yml` file in the repository.
+ Put `docker-compse.yml` file in your current directory.
+ Create a `.env` file in current directory to set enviornment variables.
```
docker compose up -d
```

# .env
Here is the example of a .env file
```
OPENAI_API_KEY=YOUR_KEY
WEIBO_COOKIE=YOUR_COOKIE
WEIBO_XSRF_TOKEN=YOUR_XSRF_TOKEN
BASE_TIME_TO_WAIT=10000
MAX_TIME_TO_WAIT=180000
```

### WEIBO_COOKIE，WEIBO_XSRF_TOKEN
+ You can find them in the network tab of browser dev tools when you are surfing weibo.

### BASE_TIME_TO_WAIT
+ The default time interval in milliseconds  to pull data from weibo.
+ The interval would increase every time there is no data avaible and decrease to `BASE_TIME_TO_WAIT` every time there is data available.

### MAX_TIME_TO_WAIT
+ The interval in milliseconds to pull data would not supress `MAX_TIME_TO_WAIT`