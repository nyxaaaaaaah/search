
<p align="center">
  <img src="/public/assets/teto_big.webp" width="100" height="100" alt="Teto">
  <br>

  <p align="center">
    search the web without AI slop. pretty, fast,<br> privacy-friendly metasearch engine.
    <br>
    <strong><a href="#installation">start searching! »</a></strong>
  </p>
</p>

<br>

![demo](./public/assets/demo.png)

<br>

[search.tiago.zip](https://search.tiago.zip) is a lightweight yet powerful metasearch engine focused on user privacy and performance. it sources data from brave search and solves challenges to provide comprehensive answers without tracking or storing user data.

### private by design

no tracking is used by default, and you can search the web with no cookies or accounts.

we do not log any type of data and your searches are never stored or analyzed.

### bangs, rich answers, snippets

similar to duckduckgo, you can use !bangs to search other sites directly. instant answers for calculations, weather, crypto prices, and more are available right on the results page. we also show previews for lyrics, youtube views, and more.

### fast and better dx

unlike html-only search engines, we start by serving css and html, only sending answers in js later, which results in a much better experience.

most keyboard shortcuts are also supported, and the image tab supports a built-in ai slop remover. on chromium-based browsers, you'll also benefit from view transitions between tabs.

### rich answers & maps

we implement most of brave's rich answer features, including calculator, color picker, timer, weather, cryptocurrency prices, and more.

### json api

once the instance author enables it, you can query the engine over a simple authenticated endpoint and get clean JSON back, no scraping required:

```bash
curl -X POST https://search.tiago.zip/api \
  -H "Authorization: Bearer YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"metasearch","type":"web","page":0}'
```

`type` is one of `web`, `images`, or `news` (defaults to `web`), and `page` is a zero-based offset with no cap. keys live in a D1 database (one row per key, so you can label and revoke them individually):

```bash
wrangler d1 create metasearch          # paste the id into wrangler.toml
wrangler d1 migrations apply metasearch --remote

KEY=$(openssl rand -hex 32)
wrangler d1 execute metasearch --remote \
  --command "INSERT INTO api_keys (key, label) VALUES ('$KEY', 'alice')"
```

full docs live at [/api](https://search.tiago.zip/api).

### self-hosting

metasearch runs on cloudflare workers with static assets. to self-host:

```bash
# clone and install
git clone https://github.com/tiagozip/metasearch.git
cd metasearch
bun install

# set your jwt secret (used to sign search tokens)
wrangler secret put JWT_SECRET

# deploy to cloudflare workers
bun run deploy
```

#### updating bangs

bangs are embedded in the bundle for zero-latency lookups. to refresh them:

```bash
bun run bangs
bun run deploy
```

#### local development

```bash
# create a .env file with a dev secret
echo 'JWT_SECRET=dev-secret' > .env

# start local dev server
bun run dev
```

#### custom domain

after deploying, you can add a custom domain in the cloudflare dashboard under workers & pages > metasearch > settings > domains & routes.

### license

all code is licensed under aGPL-v3.0. see [LICENSE](./LICENSE) for more details.
