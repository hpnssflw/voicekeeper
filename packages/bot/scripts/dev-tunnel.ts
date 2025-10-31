/*
  Dev helper: starts cloudflared quick tunnel for http://127.0.0.1:8080,
  captures the public URL from stdout, then calls Telegram setWebhook using
  TELEGRAM_BOT_TOKEN and WEBHOOK_SECRET.
*/
import dotenv from 'dotenv';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';

// Load env from packages/bot/.env when running via npm script
dotenv.config();

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

function resolveCloudflared(): string {
  if (process.env.CLOUDFLARED_PATH && fs.existsSync(process.env.CLOUDFLARED_PATH)) {
    return process.env.CLOUDFLARED_PATH;
  }
  if (process.platform === 'win32') {
    try {
      const out = spawnSync('where', ['cloudflared'], { encoding: 'utf-8' });
      const found = out.stdout?.split(/\r?\n/).find(p => p.toLowerCase().endsWith('cloudflared.exe'));
      if (found && fs.existsSync(found)) return found;
    } catch {}
    const candidates = [
      'C\\\\Program Files\\\
Cloudflare\\\\cloudflared\\\\cloudflared.exe',
      'C\\\\Program Files\\\\cloudflared\\\\cloudflared.exe',
      path.join(process.env.LOCALAPPDATA || '', 'Programs', 'cloudflared', 'cloudflared.exe'),
    ];
    for (const c of candidates) {
      if (c && fs.existsSync(c)) return c;
    }
  }
  return 'cloudflared';
}

const cfPath = resolveCloudflared();
console.log('Using cloudflared at:', cfPath);
const cf = spawn(cfPath, ['tunnel', '--url', 'http://127.0.0.1:8080']);

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


