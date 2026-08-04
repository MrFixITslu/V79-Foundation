import express from 'express';
import path from 'path';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3081;
const distPath = path.join(process.cwd(), 'dist');

app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Vision79 Frontend server running on port ${PORT}`);
});
