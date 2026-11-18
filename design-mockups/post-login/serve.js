#!/usr/bin/env node
/**
 * Dependency-free static file server for the post-login design prototype.
 *
 * Usage:
 *   node serve.js            # http://localhost:4174
 *   PORT=5000 node serve.js  # custom port
 *
 * Design notes:
 * - Files are read from disk on every request (no in-memory cache, no ETag /
 *   Last-Modified short-circuiting), so a browser refresh always shows the
 *   latest saved edits.
 * - Responses are sent with `Cache-Control: no-store` for the same reason.
 * - Requests are confined to this directory; path traversal is rejected.
 */

'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const ROOT = __dirname;
const PORT = Number(process.env.PORT) || 4174;
const HOST = process.env.HOST || '127.0.0.1';

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.cjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.bmp': 'image/bmp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.pdf': 'application/pdf',
  '.wasm': 'application/wasm',
};

function contentTypeFor(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

/**
 * Resolve a URL pathname to an absolute path inside ROOT.
 * Returns null when the request escapes ROOT or contains invalid input.
 */
function resolveSafePath(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch (err) {
    return null; // malformed percent-encoding
  }

  if (decoded.indexOf('\0') !== -1) return null;

  // Normalise separators so Windows and POSIX behave the same.
  const relative = decoded.replace(/\\/g, '/').replace(/^\/+/, '');
  const resolved = path.resolve(ROOT, relative);

  if (resolved !== ROOT && !resolved.startsWith(ROOT + path.sep)) {
    return null;
  }
  return resolved;
}

function sendPlain(res, statusCode, message, extraHeaders) {
  const body = Buffer.from(message + '\n', 'utf8');
  res.writeHead(statusCode, Object.assign({
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': body.length,
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    'X-Content-Type-Options': 'nosniff',
  }, extraHeaders || {}));
  res.end(body);
}

function serveFile(req, res, filePath) {
  fs.stat(filePath, function (statErr, stats) {
    if (statErr) {
      if (statErr.code === 'ENOENT' || statErr.code === 'ENOTDIR') {
        sendPlain(res, 404, '404 Not Found: ' + req.url);
      } else if (statErr.code === 'EACCES' || statErr.code === 'EPERM') {
        sendPlain(res, 403, '403 Forbidden');
      } else {
        sendPlain(res, 500, '500 Internal Server Error');
      }
      return;
    }

    if (stats.isDirectory()) {
      // Redirect so relative asset URLs resolve correctly.
      const target = req.url.split('?')[0].replace(/\/?$/, '/');
      res.writeHead(301, { Location: target, 'Cache-Control': 'no-store' });
      res.end();
      return;
    }

    if (!stats.isFile()) {
      sendPlain(res, 404, '404 Not Found: ' + req.url);
      return;
    }

    // Read fresh from disk on every request: no caching layer at all.
    fs.readFile(filePath, function (readErr, data) {
      if (readErr) {
        if (readErr.code === 'ENOENT') {
          sendPlain(res, 404, '404 Not Found: ' + req.url);
        } else if (readErr.code === 'EACCES' || readErr.code === 'EPERM') {
          sendPlain(res, 403, '403 Forbidden');
        } else {
          sendPlain(res, 500, '500 Internal Server Error');
        }
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentTypeFor(filePath),
        'Content-Length': data.length,
        'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
        'X-Content-Type-Options': 'nosniff',
      });

      if (req.method === 'HEAD') {
        res.end();
      } else {
        res.end(data);
      }
    });
  });
}

const server = http.createServer(function (req, res) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    sendPlain(res, 405, '405 Method Not Allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    pathname = url.parse(req.url).pathname || '/';
  } catch (err) {
    sendPlain(res, 400, '400 Bad Request');
    return;
  }

  const resolved = resolveSafePath(pathname);
  if (resolved === null) {
    sendPlain(res, 403, '403 Forbidden');
    return;
  }

  // Directory requests fall through to index.html.
  fs.stat(resolved, function (err, stats) {
    if (!err && stats.isDirectory()) {
      const indexPath = path.join(resolved, 'index.html');
      fs.stat(indexPath, function (indexErr, indexStats) {
        if (!indexErr && indexStats.isFile()) {
          serveFile(req, res, indexPath);
        } else {
          sendPlain(res, 404, '404 Not Found: no index.html in ' + pathname);
        }
      });
      return;
    }
    serveFile(req, res, resolved);
  });
});

server.on('error', function (err) {
  if (err.code === 'EADDRINUSE') {
    console.error('Port ' + PORT + ' is already in use. Stop the other process or set PORT.');
  } else {
    console.error('Server error:', err.message);
  }
  process.exitCode = 1;
});

server.listen(PORT, HOST, function () {
  console.log('post-login prototype: http://localhost:' + PORT + '/');
  console.log('Serving: ' + ROOT);
  console.log('Files are re-read on every request — refresh to see saved edits.');
  console.log('Press Ctrl+C to stop.');
});

process.on('SIGINT', function () {
  server.close(function () {
    process.exit(0);
  });
});
