FROM node:20
WORKDIR /app

# Install ffmpeg + yt-dlp for YouTube downloads and audio extraction
# Pin yt-dlp version to avoid breaking changes from latest; use ios player_client to avoid JS runtime deps
RUN apt-get update && apt-get install -y ffmpeg python3 curl \
  && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
  && chmod a+rx /usr/local/bin/yt-dlp \
  && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"]
