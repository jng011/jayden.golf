# jayden.golf

A one-page site for junior golf lessons. Live at **[jayden.golf](https://jayden.golf)**.

Static front end with a waving-flag hero, scroll reveals, a satellite-view course map,
and a lesson-request form. The form posts to a small Cloudflare Worker that emails the
request straight to me via Cloudflare Email Routing (no third-party form service).

## Stack
- Hand-built HTML/CSS/JS (`index.html`) — no framework
- **Cloudflare Pages** hosting + `functions/_middleware.js` (canonical-domain 301 redirect)
- **Cloudflare Worker** mailer (`mail-worker/worker.js`) using the `send_email` binding,
  with a honeypot bot-trap, CORS allow-list, and input escaping

## Structure
```
index.html              # the site
functions/_middleware.js # *.pages.dev -> jayden.golf redirect
mail-worker/worker.js    # lesson-request form -> email
mail-worker/wrangler.toml
```

## AI assistance (disclosure)
Design, layout, copy, and every product decision are mine — I designed the UI and directed
the build. Code implementation was AI-assisted (Claude), which is why commits carry a
`Co-Authored-By: Claude` trailer. This is assisted work, not a one-shot prompt: I iterated
on the design, the interactions, and the copy throughout.
