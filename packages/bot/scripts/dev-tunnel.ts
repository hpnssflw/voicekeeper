/*
  Dev helper: starts cloudflared quick tunnel for http://127.0.0.1:8080,
  captures the public URL from stdout, then calls Telegram setWebhook using
  TELEGRAM_BOT_TOKEN and WEBHOOK_SECRET.
*/
import { spawn } from 'node:child_process';
import https from 'node:https';

const token = process.env.TELEGRAM_BOT_TOKEN;
const secret = process.env.WEBHOOK_SECRET || '';

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

function setWebhook(publicUrl: string) {
  const payload = JSON.stringify({ url: `${publicUrl}/api/webhook/telegram?token=${encodeURIComponent(secret)}` });
  const req = https.request(
    `https://api.telegram.org/bot${token}/setWebhook`,
    { method: 'POST', headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) } },
    res => {
      let body = '';
      res.on('data', chunk => (body += chunk));
      res.on('end', () => {
        console.log('setWebhook response:', body);
      });
    }
  );
  req.on('error', err => console.error('setWebhook error:', err));
  req.write(payload);
  req.end();
}

const cf = spawn('cloudflared', ['tunnel', '--url', 'http://127.0.0.1:8080']);

cf.stdout.on('data', (data: Buffer) => {
  const text = data.toString();
  process.stdout.write(text);
  const match = text.match(/https:\/\/[^\s]+trycloudflare\.com/);
  if (match) {
    const url = match[0];
    console.log('Detected public URL:', url);
    setWebhook(url);
  }
});

cf.stderr.on('data', data => process.stderr.write(data.toString()));
cf.on('close', code => {
  console.log(`cloudflared exited with code ${code}`);
});


