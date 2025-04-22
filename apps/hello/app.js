import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { run } from './db.js';


const app = express();
const port = 3000; // Or any other port you prefer

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
    
// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'build')));
    
// Optional: Handle requests for the root path ("/")
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
    
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

run().catch(console.dir);
