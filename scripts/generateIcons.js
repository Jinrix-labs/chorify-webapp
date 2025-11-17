import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCanvas } from 'canvas';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#8b5cf6');
  gradient.addColorStop(1, '#ec4899');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  ctx.font = `${size * 0.5}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🏡', size / 2, size / 2);
  
  return canvas.toBuffer('image/png');
}

const publicDir = path.join(__dirname, '..', 'client', 'public');

fs.writeFileSync(path.join(publicDir, 'icon-192.png'), generateIcon(192));
fs.writeFileSync(path.join(publicDir, 'icon-512.png'), generateIcon(512));

console.log('Icons generated successfully!');
