const fs = require('fs');
const path = require('path');
const { minify: minifyHTML } = require('html-minifier-terser');
const { minify: minifyJS } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');
const CleanCSS = require('clean-css');

const DIST = path.join(__dirname, 'dist');

async function build() {
  // Clean & create dist
  if (fs.existsSync(DIST)) fs.rmSync(DIST, { recursive: true });
  fs.mkdirSync(DIST, { recursive: true });

  // Copy assets
  const assetsSrc = path.join(__dirname, 'assets');
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, path.join(DIST, 'assets'), { recursive: true });
  }

  // 1. Minify CSS
  const cssRaw = fs.readFileSync('styles.css', 'utf-8');
  const cssMin = new CleanCSS({ level: 2 }).minify(cssRaw).styles;

  // 2. Obfuscate JS (data.js + app.js combined)
  const dataRaw = fs.readFileSync('data.js', 'utf-8');
  const appRaw = fs.readFileSync('app.js', 'utf-8');
  const combinedJS = dataRaw + '\n' + appRaw;

  // Minify first
  const jsMinified = await minifyJS(combinedJS, {
    compress: { drop_console: true },
    mangle: true,
  });

  // Then obfuscate
  const jsObfuscated = JavaScriptObfuscator.obfuscate(jsMinified.code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.5,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.2,
    stringArray: true,
    stringArrayThreshold: 0.75,
    stringArrayEncoding: ['base64'],
    stringArrayShuffle: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    renameGlobals: false, // keep DOM IDs working
    selfDefending: false,
    identifierNamesGenerator: 'hexadecimal',
  }).getObfuscatedCode();

  // 3. Build single HTML with everything inlined
  const htmlRaw = fs.readFileSync('index.html', 'utf-8');

  // Replace external refs with inline
  const htmlInlined = htmlRaw
    .replace('<link rel="stylesheet" href="styles.css">', `<style>${cssMin}</style>`)
    .replace(/<script src="data\.js"><\/script>\s*/, '')
    .replace('<script src="app.js"></script>', `<script>${jsObfuscated}</script>`);

  // Minify HTML
  const htmlMin = await minifyHTML(htmlInlined, {
    collapseWhitespace: true,
    removeComments: true,
    removeAttributeQuotes: true,
    minifyCSS: true,
  });

  fs.writeFileSync(path.join(DIST, 'index.html'), htmlMin);

  // Stats
  const srcSize = cssRaw.length + combinedJS.length + htmlRaw.length;
  const distSize = htmlMin.length;
  console.log(`Build complete → dist/index.html`);
  console.log(`Source: ${(srcSize / 1024).toFixed(1)}KB → Dist: ${(distSize / 1024).toFixed(1)}KB`);
  console.log(`JS obfuscated, CSS minified, HTML inlined.`);
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
