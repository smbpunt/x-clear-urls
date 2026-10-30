# X-Clear-URLs

A browser extension that strips tracking parameters from the links you copy, so that sharing a link does not share who you are.

When you click "Copy link" on YouTube, you get `https://youtu.be/dQw4w9WgXcQ?si=AbCdEf123`. The `si` param identifies you as the person who shared it. With X-Clear-URLs, the clipboard gets `https://youtu.be/dQw4w9WgXcQ` instead.

- Works with the site's own share/copy buttons and with plain Ctrl+C.
- Only removes params known to be tracking. Params needed to open the link (video id, timestamp, playlist…) are kept.
- No network requests and no data collection. The history of cleaned links stays in your browser.

## Supported sites

| Site | Removed params |
|---|---|
| X / Twitter | everything on post links; `s`, `t`, `a`, `cn`, `src`, `ref_src`, `ref_url` elsewhere |
| YouTube | `si`, `pp`, `feature`, `kw`, `gclid` |

The source of truth is [`rules.ts`](rules.ts).

Only the **desktop web** version of sites is targeted. Mobile apps add their own params, which this extension cannot see.

## Install from source

Requires Node.js 24+ and pnpm.

```sh
pnpm install
pnpm build           # Chrome  → .output/chrome-mv3
pnpm build:firefox   # Firefox → .output/firefox-mv3
```

Then load the output folder as an unpacked extension (`chrome://extensions`, developer mode) or as a temporary add-on (`about:debugging` in Firefox).

## Development

```sh
pnpm dev             # Chrome with hot reload
pnpm dev:firefox
pnpm test            # replays the examples of every rule
pnpm compile         # type check
```

How it works:

1. `entrypoints/sites.content.ts` runs in the page (MAIN world) on supported sites and installs the site's **handlers**.
2. A handler intercepts links where they leave the page. Today there is a single one, `clipboard`, which patches the clipboard APIs.
3. Each link is cleaned according to its site's **rule** in `rules.ts`.
4. Cleaned links are reported to the background (through `entrypoints/bridge.content.ts`), which keeps the counter and history shown in the popup.

## Contributing

Found a link that still carries tracking? Open an issue with the "New site or tracking param" template, or send a pull request. Adding a param is usually a one-line change in `rules.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[MIT](LICENSE)
