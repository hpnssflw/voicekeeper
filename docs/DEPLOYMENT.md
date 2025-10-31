## VPS Deployment Guide (Docker + Nginx + SSL)

This guide describes a reproducible production setup on a single Ubuntu VPS using Docker, Docker Compose, and Nginx with Let's Encrypt SSL.

### 1) Prerequisites
- VPS: Ubuntu 22.04+ (2 vCPU, 4 GB RAM, 50 GB SSD or more)
- Domains:
  - `app.example.com` → Next.js Admin (packages/webapp)
  - `bot.example.com` → Bot API/Webhooks (packages/bot)
- DNS A records pointing to the VPS public IP
- SSH access as a sudo-capable user (avoid root for daily ops)

### 2) System preparation
SSH into the server and run:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw
```

Firewall (optional but recommended):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

Install Docker & Compose:
```bash
bash infra/scripts/install_docker.sh
```

### 3) Fetch code and configure environment
```bash
cd ~
git clone <YOUR_REPO_URL> telegram-voronka
cd telegram-voronka
cp .env.example .env
```

Edit `.env` and set values:
- `JWT_SECRET` — strong random
- `APP_BASE_URL=https://app.example.com`
- `BOT_BASE_URL=https://bot.example.com`
- `MONGO_URI=mongodb://mongodb:27017/app` (default local compose)
- `REDIS_URL=redis://redis:6379`
- `YANDEX_METRIKA_ID` — optional
- S3 variables if used

### 4) Nginx vhosts and SSL
Edit `infra/nginx/app.conf` and `infra/nginx/bot.conf` replace `example.com` with your domains.

Install certbot and request certificates:
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo cp infra/nginx/app.conf /etc/nginx/sites-available/app.conf
sudo cp infra/nginx/bot.conf /etc/nginx/sites-available/bot.conf
sudo ln -sf /etc/nginx/sites-available/app.conf /etc/nginx/sites-enabled/app.conf
sudo ln -sf /etc/nginx/sites-available/bot.conf /etc/nginx/sites-enabled/bot.conf
sudo nginx -t && sudo systemctl reload nginx

sudo certbot --nginx -d app.example.com --redirect --non-interactive --agree-tos -m you@example.com
sudo certbot --nginx -d bot.example.com --redirect --non-interactive --agree-tos -m you@example.com
```

Auto-renewal is handled by certbot timer by default. Verify with `systemctl status certbot.timer`.

### 5) Build and start services
```bash
cd ~/telegram-voronka/infra
docker compose pull
docker compose build
docker compose up -d
```

First run may take several minutes. Check containers:
```bash
docker compose ps
docker compose logs -f nginx
```

### 6) Webhook configuration (Telegram)
After `bot` service is reachable at `https://bot.example.com`, set your bot webhook (replace placeholders):
```bash
curl -X POST "https://api.telegram.org/bot<TELEGRAM_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://bot.example.com/webhook/<botUsername>?token=<WEBHOOK_SECRET>"}'
```

You can also implement automatic webhook setup in the app when registering a bot.

### 7) Operations

Deploy (pull latest, rebuild, restart):
```bash
bash infra/scripts/deploy.sh
```

Tail logs:
```bash
bash infra/scripts/logs.sh bot    # or webapp, nginx, mongodb, redis
```

MongoDB backup/restore:
```bash
# Backup to infra/backups/<timestamp>.gz
bash infra/scripts/backup_mongo.sh

# Restore latest dump
bash infra/scripts/restore_mongo.sh infra/backups/<dump>.gz
```

Prune old images/volumes (caution):
```bash
bash infra/scripts/prune.sh
```

### 8) Health checks & monitoring
- Use external uptime checks for `app.example.com` and `bot.example.com`
- Consider pushing container logs to a central store (Loki/ELK) later
- Add alerts on 5xx and queue failures

### 9) Security notes
- Keep `.env` secret; do not commit it
- Rotate `JWT_SECRET` and bot tokens periodically
- Ensure only ports 80/443 are exposed publicly
- Use strong SSH keys and disable password login

### 10) Troubleshooting
- `docker compose logs -f bot` to view bot errors
- Nginx config test: `sudo nginx -t`
- Certificate issues: `sudo certbot certificates` and rerun certbot
- Webhook debugging: check Telegram `getWebhookInfo`


