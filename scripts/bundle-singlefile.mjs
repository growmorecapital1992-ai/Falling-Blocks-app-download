import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const publicDir = path.resolve('public');

if (!fs.existsSync(distDir)) {
  console.error('Dist directory does not exist. Run npm run build first.');
  process.exit(1);
}

const assetsDir = path.join(distDir, 'assets');
const files = fs.readdirSync(assetsDir);

const jsFile = files.find(f => f.endsWith('.js'));
const cssFile = files.find(f => f.endsWith('.css'));

if (!jsFile || !cssFile) {
  console.error('Could not find js or css in dist/assets');
  process.exit(1);
}

const jsContent = fs.readFileSync(path.join(assetsDir, jsFile), 'utf-8');
const cssContent = fs.readFileSync(path.join(assetsDir, cssFile), 'utf-8');

// Also inline creator photo as base64 so the offline app is 100% self-contained
const imgPath = path.join(publicDir, 'assets/aistudio/creator_ayush_kumar_74687dae.png');
let imgBase64 = '';
if (fs.existsSync(imgPath)) {
  imgBase64 = 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');
}

// Replace references to the image path with inline base64
let finalJs = jsContent;
if (imgBase64) {
  finalJs = finalJs.split('/assets/aistudio/creator_ayush_kumar_74687dae.png').join(imgBase64);
}

const standaloneHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Falling Blocks: Classic Brick Edition - By Ayush Kumar</title>
    <meta name="description" content="Falling Blocks: Classic Brick Edition - Developed and Published by Ayush Kumar." />
    <meta name="author" content="Ayush Kumar" />
    <meta name="theme-color" content="#06b6d4" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&family=VT323&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
    <style>
${cssContent}
    </style>
  </head>
  <body class="bg-neutral-950 text-neutral-100 select-none overflow-hidden m-0 p-0">
    <div id="root"></div>
    <script type="module">
${finalJs}
    </script>
  </body>
</html>`;

const outputPath = path.join(publicDir, 'Falling-Blocks-Ayush-Kumar.html');
fs.writeFileSync(outputPath, standaloneHtml, 'utf-8');

const distOutputPath = path.join(distDir, 'Falling-Blocks-Ayush-Kumar.html');
fs.writeFileSync(distOutputPath, standaloneHtml, 'utf-8');

const stats = fs.statSync(outputPath);
console.log(`Standalone offline game app created successfully! Size: ${(stats.size / 1024).toFixed(1)} KB at ${outputPath}`);
