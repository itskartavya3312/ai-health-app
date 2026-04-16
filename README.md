# 🩺 HealthAI — AI-Powered Health Assistant

Built with **Next.js 14** + **Tailwind CSS** + **MongoDB Atlas** + **Gemini 2.5 Flash**.  
Runs 100% free (Vercel + Atlas free tiers). Only cost: Gemini API usage.

---

## 📁 Folder Structure

```
health-ai-app/
├── app/
│   ├── globals.css                   # Custom medical theme + animations
│   ├── layout.jsx                    # Root layout, Navbar, ChatWidget, Footer
│   ├── page.jsx                      # Homepage: Hero + Search + Disease Grid
│   ├── disease/[slug]/page.jsx       # Dynamic disease detail page (SSR)
│   ├── symptom-checker/page.jsx      # Dedicated symptom checker page
│   └── api/
│       ├── diseases/route.js         # GET all diseases / POST create
│       ├── diseases/[slug]/route.js  # GET one + Gemini fallback + cache
│       ├── search/route.js           # Smart search: DB first → AI fallback
│       ├── symptom-check/route.js    # POST symptom analysis via Gemini
│       ├── chat/route.js             # POST health chatbot via Gemini
│       └── seed/route.js             # GET seed 10 diseases into MongoDB
├── components/
│   ├── Navbar.jsx          # Sticky responsive navigation + mobile menu
│   ├── SearchBar.jsx       # Debounced autocomplete search
│   ├── DiseaseCard.jsx     # Disease card with category colors
│   ├── SymptomChecker.jsx  # AI symptom input + structured results
│   └── ChatWidget.jsx      # Floating WhatsApp-style AI chatbot
├── lib/
│   ├── mongodb.js          # Singleton connection (serverless-safe)
│   └── gemini.js           # All Gemini calls + rate limiter + parsers
├── models/
│   ├── Disease.js          # Mongoose disease schema + text indexes
│   └── AiCache.js          # Response cache model with TTL auto-delete
├── .env.local.example
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## ⚡ Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local`:
```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/healthai?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### 3. Get your API keys

**MongoDB Atlas (Free)**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free M0 cluster
3. Create a database user
4. Whitelist IP `0.0.0.0/0`
5. Click Connect → Drivers → copy connection string

**Gemini API Key (Free tier available)**
1. Go to [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Create a new API key
3. Paste into `GEMINI_API_KEY`

### 4. Run development server
```bash
npm run dev
```

### 5. Seed the database
Open: [http://localhost:3000/api/seed](http://localhost:3000/api/seed)

You should see: `✅ Seeded 10 diseases, 0 already existed.`

### 6. Open the app
[http://localhost:3000](http://localhost:3000)

---

## 🚀 Deploy to Vercel (Free)

### Option A: CLI
```bash
npm install -g vercel
vercel
# Follow prompts — add env vars when asked
```

### Option B: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select your repo
4. Add Environment Variables:
   - `MONGODB_URI`
   - `GEMINI_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` → your Vercel URL (e.g. `https://health-ai.vercel.app`)
5. Click **Deploy**
6. After deploy, visit `https://your-app.vercel.app/api/seed`

---

## 💰 Cost Optimization

| Strategy | Saving |
|---|---|
| MongoDB-first search | Skips Gemini for known diseases |
| 7-day response cache in DB | Avoids duplicate Gemini calls |
| 10 AI calls/IP/minute rate limit | Prevents abuse |
| Input truncated to 2000 chars | Reduces input tokens |
| Max 500–800 output tokens | Reduces output tokens |
| Autocomplete = DB only | Zero AI cost while typing |

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/diseases` | List all diseases |
| GET | `/api/diseases/:slug` | Get disease (DB → Gemini fallback) |
| GET | `/api/search?q=query` | Smart search with autocomplete |
| POST | `/api/symptom-check` | AI symptom analysis |
| POST | `/api/chat` | AI health chatbot |
| GET | `/api/seed` | Seed 10 sample diseases |

---

## 🧬 Database Schema

### Disease
```js
{ name, slug, category, severity, icon, overview,
  causes[], symptoms[], treatments[], prevention[],
  exercises[], diet[], diagnosis, aliases[],
  prevalence, source: 'seed|gemini|manual', views }
```

### AiCache
```js
{ cacheKey, type, input, response, hitCount, expiresAt }
// TTL index on expiresAt — MongoDB auto-deletes expired docs
```

---

## ⚠️ Medical Disclaimer

This application is for **informational purposes only** and is **not a substitute** for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional.
