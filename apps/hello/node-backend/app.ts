import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from './db.js';


const app = express();
const port = 3000; // Or any other port you prefer

const __filename = fileURLToPath(import.meta.url);
const staticDir = path.dirname(__filename);

console.log('serving files from: ', staticDir);

// Serve static files from the 'frontend' directory
app.use(express.static(staticDir));
    
// Optional: Handle requests for the root path ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(staticDir, 'index.html'));
});
    
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

run().catch(console.dir);
