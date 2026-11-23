'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { composeAnswer, areas } = require('./lib/engine');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
};

function logEvent(tag, data) {
  const clean = { ...data, q: String(data.q || '').replace(/\s+/g, ' ').slice(0, 300), t: new Date().toISOString() };
  console.log(`[${tag}] ${JSON.stringify(clean)}`);
}

function sendJSON(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Content-Length': Buffer.byteLength(body) });
  res.end(body);
}

function serveStatic(req, res, pathname) {
  const safePath = path.normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, '');
  const filePath = path.join(PUBLIC_DIR, safePath === '' || safePath === '.' ? 'index.html' : safePath);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403); res.end('Forbidden'); return;
  }
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('No encontrado');
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream', 'Cache-Control': ext === '.png' ? 'public, max-age=86400' : 'no-cache' });
    res.end(data);
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1e5) { req.destroy(); reject(new Error('Payload demasiado grande')); }
    });
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

async function readJSON(req) {
  const raw = await readBody(req);
  try { return JSON.parse(raw || '{}'); } catch { return {}; }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      sendJSON(res, 200, { ok: true });
      return;
    }

    if (pathname === '/api/ask' && req.method === 'POST') {
      const body = await readJSON(req);
      const message = String(body.message || '').slice(0, 1000);
      const answer = composeAnswer(message);
      // Visible in Render > Logs: the questions the knowledge base could not answer yet.
      if (answer.noMatch) logEvent('SIN_RESPUESTA', { q: message });
      sendJSON(res, 200, { answer });
      return;
    }

    if (pathname === '/api/feedback' && req.method === 'POST') {
      const body = await readJSON(req);
      logEvent(body.util ? 'FEEDBACK_UTIL' : 'FEEDBACK_NO_UTIL', { q: String(body.q || ''), temas: Array.isArray(body.temas) ? body.temas.slice(0, 5).map(String) : [] });
      sendJSON(res, 200, { ok: true });
      return;
    }

    if (pathname === '/api/areas' && req.method === 'GET') {
      sendJSON(res, 200, {
        areas: areas.map((a) => ({
          id: a.id,
          num: a.num,
          icono: a.icono,
          titulo: a.titulo,
          temas: a.temas.map((t) => ({ id: t.id, titulo: t.titulo })),
        })),
      });
      return;
    }

    if (pathname.startsWith('/api/')) {
      sendJSON(res, 404, { error: 'Ruta no encontrada' });
      return;
    }

    serveStatic(req, res, pathname);
  } catch (err) {
    sendJSON(res, 500, { error: 'Error interno', detail: String((err && err.message) || err) });
  }
});

server.listen(PORT, () => {
  console.log(`MEDICONSULTAS corriendo en http://localhost:${PORT}`);
});
