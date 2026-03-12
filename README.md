# PixAI — Portfolio

UA Ads for Mobile Games & Apps — by Ivo Silveira.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to Vercel (recommended — fastest)

1. Push this folder to a **GitHub repo**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/pixai-portfolio.git
   git branch -M main
   git push -u origin main
   ```

2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub

3. Click **"Add New Project"** → Import your repo

4. Vercel auto-detects Vite — just click **Deploy**

5. Done! Your site will be live at `pixai-portfolio.vercel.app`

6. (Optional) Connect a custom domain in Vercel → Settings → Domains

## Updating Content

### Add/edit projects
Edit the `PROJECTS` array in `src/App.jsx`:

```js
{
  id: 1,
  title: "Sniper Battle",
  category: "Video Ads",
  tags: ["AI-Generated", "UGC", "Motion"],
  color: "#FF3366"
}
```

### Add project thumbnails
Place images in `public/projects/` and reference them in the project cards.

### Push updates
```bash
git add .
git commit -m "Update projects"
git push
```
Vercel auto-deploys on every push to `main`.

## Tech Stack

- React 18
- Vite 6
- Vanilla CSS (no dependencies)
