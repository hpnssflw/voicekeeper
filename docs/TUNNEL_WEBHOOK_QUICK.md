## Quick Flow: Start bot, open tunnel, set webhook

Run exactly these commands (Windows PowerShell). Replace `<PUBLIC_URL>` with the URL printed by cloudflared.

1) Start the bot
```powershell
cd C:\CODE\707\telegram-voronka\packages\bot
npm run build
npm run start
```

2) Start the webapp (optional but recommended in separate terminal)
```powershell
cd C:\CODE\707\telegram-voronka\packages\webapp
npm run dev
```

3) Start the tunnel for the bot (copy the HTTPS URL it prints)
```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:8080
```

4) Set Telegram webhook (use your current bot token)
```powershell
Invoke-WebRequest -Uri "https://api.telegram.org/bot8383896351:AAFZHQuTFCVhfpNbLx0i6drM3KtNj_gWF7c/setWebhook" `
  -Method POST -ContentType "application/json" `
  -Body '{"url":"https://adaptation-learn-entity-wireless.trycloudflare.com/api/webhook/telegram?token=dev_webhook_secret"}'
```

5) Verify webhook
```powershell
curl.exe "https://api.telegram.org/bot8383896351:AAFZHQuTFCVhfpNbLx0i6drM3KtNj_gWF7c/getWebhookInfo"
```

Optional: HTTPS for Mini App button
- Start tunnel for webapp
```powershell
& "C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:3000
```
- Set `WEBAPP_URL` in `packages/bot/.env` then restart the bot
```powershell
# packages\bot\.env
WEBAPP_URL=https://<PUBLIC_WEBAPP_URL>/mini
```

Cleanup old bot webhook (if needed)
```powershell
curl.exe "https://api.telegram.org/bot6354133103:AAHXGPY-vLszd215gqcG_Hr1JvbkhV77uVg/deleteWebhook?drop_pending_updates=true"
```


