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
    -v ./.env:/app/.env 
    -e OPENAI_API_KEY=YOUR_KEY
    -e WEIBO_COOKIE=YOUR_COOKIE
    -e BOT_TYPE=0
    pikilee/chatboot:latest
```

## Docker compose
+ You can find `docker-compse.yml` file in the repository.
+ Put `docker-compse.yml` file in your current directory.
+ Create a `.env` file in current directory to set enviornment variables.
```
docker compose up -d
```

## .env
Here is the example of a .env file
```
OPENAI_API_KEY=YOUR_KEY
WEIBO_COOKIE=YOUR_COOKIE
BOT_TYPE=0
```

### WEIBO_COOKIE
+ You can find it in the network tab of browser dev tools when you are surfing weibo.

### BOT_TYPE
+ `0` for OpenAiChatWeibobot
+ `1` for OpenAiCompenletionWeibobot