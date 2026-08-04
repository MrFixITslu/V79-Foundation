import express from 'express';
import path from 'path';
import http from 'http';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3081;
const BACKEND_URL = process.env.BACKEND_URL || 'http://backend:3080';
const distPath = path.join(process.cwd(), 'dist');

// Proxy /api requests to backend service
app.use('/api', (req, res) => {
  const targetUrl = `${BACKEND_URL}${req.originalUrl}`;
  const parsedUrl = new URL(targetUrl);
  
  const options = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port || (parsedUrl.protocol === 'https:' ? 443 : 80),
    path: parsedUrl.pathname + parsedUrl.search,
    method: req.method,
    headers: {
      ...req.headers,
      host: parsedUrl.host,
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error connecting to backend:', err);
    res.status(502).json({ 
      success: false,
      error: 'Backend API Gateway 502 Bad Gateway', 
      message: 'Unable to reach backend container service at ' + BACKEND_URL,
      details: err.message 
    });
  });

  req.pipe(proxyReq, { end: true });
});

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Vision79 Frontend server running on port ${PORT}, proxying /api to ${BACKEND_URL}`);
});
