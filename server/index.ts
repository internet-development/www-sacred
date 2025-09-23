import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import imageProxyRouter from './routes/image-proxy';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isDevelopment = process.env.NODE_ENV !== 'production';

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/image-proxy', imageProxyRouter);

// Serve static files in production
if (!isDevelopment) {
  // Serve static files from the client build directory
  app.use(express.static(path.join(__dirname, '../client')));

  // Serve static metadata files
  app.get('/manifest.json', (req, res) => {
    res.json({
      background_color: '#000000',
      description: 'SRCL is an open-source React component and style repository that helps you build web applications, desktop applications, and static websites with terminal aesthetics.',
      display: 'standalone',
      icons: [
        {
          purpose: 'any',
          sizes: '520x520',
          src: '/template-app-icon.png',
          type: 'image/png',
        },
      ],
      name: 'srcl',
      orientation: 'portrait',
      short_name: 'srcl',
      start_url: '/',
      theme_color: '#000000',
    });
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://sacred.computer/sitemap.xml`);
  });

  app.get('/sitemap.xml', (req, res) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://sacred.computer</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>
</urlset>`);
  });

  // Handle client-side routing - serve index.html for all other routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
  });
}

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
