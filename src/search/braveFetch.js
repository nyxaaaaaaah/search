const TIMEOUT_MS = 7000;

const braveFetch = async (url, options = {}) => {
  const method = options.method || "GET";
  const attempts = options.attempts || 2;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
    Cookie: "theme=dark; country=all; useLocation=0",
    "sec-ch-ua": '"Chromium";v="133", "Not(A:Brand";v="99"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"macOS"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "sec-gpc": "1",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    ...options.headers,
  };

  let lastErr;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 250 * attempt));
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT_MS);
    try {
      const resp = await fetch(url, {
        method,
        headers,
        body: options.body,
        signal: ac.signal,
      });
      const bodyText = await resp.text();
      const blocked =
        resp.status === 403 ||
        resp.status === 429 ||
        (options.sniffBlockPage &&
          resp.status === 200 &&
          bodyText.length < 20000 &&
          /captcha|challenge|unusual traffic|access denied/i.test(bodyText));
      if (resp.status >= 500 || blocked) {
        lastErr = Object.assign(
          new Error(
            `brave ${resp.status}${resp.status === 200 ? " (blocked)" : ""}`,
          ),
          { status: resp.status, blocked: Boolean(blocked) },
        );
        continue;
      }
      return {
        ok: resp.ok,
        status: resp.status,
        headers: Object.fromEntries(resp.headers),
        text: async () => bodyText,
        json: async () => JSON.parse(bodyText),
      };
    } catch (e) {
      lastErr =
        e?.name === "AbortError"
          ? Object.assign(new Error("brave timed out"), { timeout: true })
          : e;
    } finally {
      clearTimeout(timer);
    }
  }
  throw lastErr;
};

export default braveFetch;
