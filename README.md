# weedding

## Directory structure

```
weedding/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── friends/              # CRUD & storage for guest list
│   │   │   ├── storage-status/   # GET Redis/filesystem status
│   │   │   ├── update/           # POST update guest info
│   │   │   └── [slug]/           # GET/POST by invitation slug
│   │   └── gallery/              # Gallery images API
│   ├── thiepmoi/                 # Invitation pages (list + detail)
│   │   └── [slug]/               # Invitation page by slug
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Wedding homepage
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── wedding/                  # Wedding page sections (hero, gallery, RSVP, …)
│   └── theme-provider.tsx
├── context/
│   └── friend-context.tsx        # Guest list context
├── hooks/
│   ├── use-mobile.ts
│   └── use-toast.ts
├── lib/
│   ├── friends-storage.ts        # Redis / file storage
│   ├── friends.ts                # Friends/guests logic
│   ├── utils.ts
│   └── wedding-config.ts         # Wedding config
├── public/                       # Static assets
│   ├── gallery/                  # Gallery images
│   ├── images/                   # Page images (hero, og, …)
│   ├── *.mp3                     # Background music
│   └── icon*, placeholder*       # Favicon, placeholders
├── scripts/
│   ├── normalize-friends.js      # Normalize friends.json
│   └── pull-friends.js           # Pull friends from API (Vercel) to file
├── styles/
│   └── globals.css
├── friends.json                  # Guest list (seed / backup)
└── ...
```

## Deploy to Vercel – enable Create/Update RSVP

Vercel has a read-only filesystem, so **create/update invitation** data must be stored via Redis.

### Created Redis store (Upstash) but still getting 500/503?

1. **Attach the store to your project**
   - Vercel Dashboard → **your project** (wedding app) → **Storage** tab.
   - In the Storage list, find the store **upstash-kv-bronze-horizon** (or whatever you named it).
   - It must show **Connected** / **Linked** to this project. If not: click **Connect** (or **Link to Project**) and select the correct project → Save.

2. **Check Environment Variables**
   - Project → **Settings** → **Environment Variables**.
   - You need: `KV_REST_API_URL` and `KV_REST_API_TOKEN` (for **Production** and **Preview** if you test preview builds).
   - If missing: go back to Storage → select the store → Connect/Link section and ensure it’s linked to the project; Vercel will add the variables automatically.

3. **Redeploy**
   - **Deployments** → latest deployment → **⋯** menu → **Redeploy** (without cache).
   - Env vars only take effect after redeploy.

4. **Verify on the server**
   - Open: `https://<your-domain>/api/friends/storage-status`
   - If `redisConfigured: true` and `storage: "redis"` → you’re good; create/update will use Redis.
   - If `redisConfigured: false` → env is not available on the server; repeat steps 1–3.

Once Redis is working, the API will copy data from `friends.json` (in the repo) into Redis on first use, then all changes are stored in Redis.

### Get latest friends data (stored in Redis)

- **Option 1 – Browser:** Open `https://<domain>/api/friends` → the page returns full list as JSON → Ctrl+S (or Cmd+S) to save as `friends.json`.
- **Option 2 – Script:** In the repo run:
  ```bash
  API_URL=https://<your-vercel-domain> node scripts/pull-friends.js
  ```
  The script fetches from the API and overwrites `friends.json` in the project root.
