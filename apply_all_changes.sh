#!/usr/bin/env bash
set -e
ROOT="$(pwd)"
echo "Apply changes from: $ROOT"
if [ ! -d "frontend" ]; then
  echo "Error: frontend/ directory not found. Run this from repo root."
  exit 1
fi

# 1) Update frontend/package.json via Node
node -e "
const fs=require('fs'), p='frontend/package.json';
if(!fs.existsSync(p)){ console.error('frontend/package.json not found'); process.exit(1); }
const j=JSON.parse(fs.readFileSync(p,'utf8'));
j.homepage='https://iwtbg-8.github.io/horror-story';
j.scripts=j.scripts||{};
j.scripts.predeploy='npm run build';
j.scripts.deploy='gh-pages -d build';
j.devDependencies=j.devDependencies||{};
j.devDependencies['gh-pages']='^6.2.0';
// avoid overwriting existing versions of other devDependencies
fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n');
console.log('Updated',p);
"

# 2) Overwrite frontend/public/index.html
mkdir -p frontend/public
cat > frontend/public/index.html <<'HTML'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000" />
    <meta
      name="description"
      content="Read the most terrifying horror stories that will haunt your dreams"
    />

    <!-- Favicon / PWA -->
    <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="apple-touch-icon" href="%PUBLIC_URL%/apple-touch-icon.png" />

    <!-- SEO -->
    <link rel="canonical" href="https://iwtbg-8.github.io/horror-story" />
    <meta name="robots" content="index,follow" />

    <!-- Open Graph -->
    <meta property="og:title" content="Dark Tales - Horror Stories" />
    <meta property="og:description" content="Read the most terrifying horror stories that will haunt your dreams" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://iwtbg-8.github.io/horror-story" />
    <meta property="og:site_name" content="Dark Tales" />
    <meta property="og:image" content="%PUBLIC_URL%/og-image.png" />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Dark Tales - Horror Stories" />
    <meta name="twitter:description" content="Read the most terrifying horror stories that will haunt your dreams" />
    <meta name="twitter:image" content="%PUBLIC_URL%/og-image.png" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Creepster&family=Nosifer&family=Grenze+Gotisch:wght@400;700&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">

    <title>Dark Tales - Horror Stories</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
HTML
echo "Wrote frontend/public/index.html"

# 3) Add frontend/src/api.js
mkdir -p frontend/src
cat > frontend/src/api.js <<'JS'
/*
  Central API client and base URL
  Usage:
    import { apiClient } from './api';
    const r = await apiClient.get('/your-endpoint');
*/
export const API_URL =
  process.env.REACT_APP_API_URL || "https://horror-story.onrender.com";

import axios from "axios";
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000
});
JS
echo "Wrote frontend/src/api.js"

# 4) Add GitHub Actions workflow
mkdir -p .github/workflows
cat > .github/workflows/gh-pages.yml <<'YML'
name: Deploy Frontend to GitHub Pages

on:
  push:
    branches: [ "main" ]
    paths:
      - "frontend/**"

permissions:
  contents: write

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      - run: npm install
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: https://horror-story.onrender.com
      - name: SPA 404 fallback
        run: cp build/index.html build/404.html
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: frontend/build
YML
echo "Wrote .github/workflows/gh-pages.yml"

# 5) Insert CORS into backend/server.js (if present and not already configured)
BACKEND="backend/server.js"
if [ -f "$BACKEND" ]; then
  echo "Patching $BACKEND for CORS..."
  node - <<'NODE'
const fs = require('fs');
const p = 'backend/server.js';
if(!fs.existsSync(p)){ console.error('no backend server file'); process.exit(0); }
let s = fs.readFileSync(p,'utf8');
// if cors already used, skip
if(/cors\\(|app.use\\([^)]*cors\\(/.test(s)){
  console.log('CORS appears already configured — skipping insertion.');
  process.exit(0);
}
// find insertion point after app declaration
let insert = `\n// CORS: allow GitHub Pages and Render frontend\nconst cors = require('cors');\napp.use(cors({\n  origin: [\n    'https://iwtbg-8.github.io',\n    'https://iwtbg-8.github.io/horror-story',\n    'https://horror-story.onrender.com'\n  ],\n  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS']\n}));\n`;
// try to find "const app = express()" or "const app = express();"
let re = /(const|let|var)\\s+app\\s*=\\s*express\\(\\)\\s*;?/;
let m = s.match(re);
if(m){
  // insert after the matched line
  s = s.replace(re, m[0] + insert);
  fs.writeFileSync(p, s, 'utf8');
  console.log('Inserted CORS into', p);
} else {
  console.log('Could not find app = express() in', p, ' — please add CORS manually.');
}
NODE
else
  echo "No backend/server.js found at $BACKEND, skipping CORS insertion."
fi

# 6) Install frontend deps (including gh-pages) and build
echo "Installing frontend dependencies..."
npm install --prefix frontend
echo "Building frontend..."
npm run build --prefix frontend

# 7) Commit and push
git add -A
git commit -m "Configure GitHub Pages deploy, API client, SEO meta and workflow" || echo "Nothing to commit"
git push || echo "Push failed or no remote set"

echo ""
echo "Finished. Verify changes, then ensure GitHub repo Settings -> Pages is configured (if using gh-pages)"
echo "If backend uses ES modules (import), adjust backend/server.js to import cors instead of require."
echo "If anything fails, paste the error output here."