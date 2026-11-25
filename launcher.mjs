import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceDir = path.join(__dirname, 'workspace');

// MIME types dictionary for static file serving
const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.mjs': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=UTF-8'
};

function serveStatic(dir, port, name) {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      // CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      let reqPath = decodeURIComponent(new URL(req.url, `http://localhost:${port}`).pathname);
      if (reqPath.endsWith('/')) reqPath += 'index.html';
      let filePath = path.join(dir, reqPath);

      // Prevent directory traversal
      if (!filePath.startsWith(dir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      if (!fs.existsSync(filePath)) {
        // Fallback to index.html for SPA if not found
        const fallback = path.join(dir, 'index.html');
        if (fs.existsSync(fallback)) {
          filePath = fallback;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
          return;
        }
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
          res.end('500 Internal Error');
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });

    server.listen(port, '0.0.0.0', () => {
      console.log(`[${name}] Running at http://localhost:${port}`);
      resolve(server);
    });
  });
}

async function startAll() {
  console.log('====================================================');
  console.log('       StoreMesh System Local Service Launcher      ');
  console.log('====================================================\n');

  // 1. Start Site Server (Iran)
  const siteServerDir = path.join(workspaceDir, 'storemesh-site-server');
  const siteServerModule = await import(path.join(siteServerDir, 'src', 'server.js'));
  const dataDir = path.join(__dirname, 'data');
  fs.mkdirSync(dataDir, { recursive: true });
  process.env.DATA_FILE = path.join(dataDir, 'storemesh-iran.json');
  process.env.PORT = '3000';
  process.env.AUTH_REQUIRED = 'false';
  process.env.SITE_CODE = 'IRAN';
  const siteServer = await siteServerModule.createRuntimeServer();
  await new Promise(r => siteServer.listen(3000, '0.0.0.0', () => {
    console.log('[Iran Site API] Running at http://localhost:3000 (Health: http://localhost:3000/health)');
    r();
  }));

  // 2. Start Cloud API
  const cloudDir = path.join(workspaceDir, 'storemesh-cloud');
  const cloudModule = await import(path.join(cloudDir, 'src', 'server.js'));
  process.env.PORT = '4000';
  const cloudRepository = new (await import(path.join(cloudDir, 'src', 'repository.js'))).JsonEventRepository(
    path.join(dataDir, 'storemesh-cloud-events.json')
  );
  const cloudAggregator = new cloudModule.Aggregator({ repository: cloudRepository });
  const cloudServer = cloudModule.createServer(cloudAggregator);
  await new Promise(r => cloudServer.listen(4000, '0.0.0.0', () => {
    console.log('[Cloud API]     Running at http://localhost:4000 (Health: http://localhost:4000/health)');
    r();
  }));

  // 3. Serve StoreMesh Web Client
  const webDir = path.join(workspaceDir, 'storemesh-web');
  const webServer = await serveStatic(webDir, 8080, 'Web Client');

  // 4. Serve Terminal Client
  const terminalDir = path.join(workspaceDir, 'storemesh-terminal');
  const terminalServer = await serveStatic(terminalDir, 8081, 'Terminal UI');

  // 5. Serve PDA Client
  const pdaDir = path.join(workspaceDir, 'storemesh-pda');
  const pdaServer = await serveStatic(pdaDir, 8082, 'PDA UI');

  // 6. Start Figma Make UI Prototype (Vite)
  const prototypeDir = path.join(workspaceDir, 'figma-make-ui-prototype');
  console.log('[Prototype]    Starting Figma Make Interactive UI on http://localhost:8443 ...');
  const viteProcess = spawn(
    'pnpm',
    ['dev', '--host', '0.0.0.0', '--port', '8443'],
    { cwd: prototypeDir, stdio: ['ignore', 'pipe', 'pipe'] }
  );

  viteProcess.stdout.on('data', (d) => {
    const s = d.toString();
    if (s.includes('Local:')) {
      console.log(`[Prototype]    Figma Make UI ready at http://localhost:8443`);
    }
  });

  console.log('\n====================================================');
  console.log('       ALL SERVICES ARE ONLINE & ACCESSIBLE:       ');
  console.log('====================================================');
  console.log('1. Figma Make UI Prototype:  http://localhost:8443');
  console.log('2. Web Management Panel:     http://localhost:8080');
  console.log('3. Station Terminal:         http://localhost:8081');
  console.log('4. PDA Handheld:             http://localhost:8082');
  console.log('5. Iran Site API:            http://localhost:3000/health');
  console.log('6. Cloud Aggregator API:     http://localhost:4000/health');
  console.log('====================================================\n');

  const shutdown = () => {
    console.log('\nShutting down all services...');
    siteServer.close();
    cloudServer.close();
    webServer.close();
    terminalServer.close();
    pdaServer.close();
    viteProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startAll().catch(err => {
  console.error('Fatal launcher error:', err);
  process.exit(1);
});
