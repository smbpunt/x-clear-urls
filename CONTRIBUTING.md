# Contributing

Thanks for helping! Most contributions are a change to a single file: [`rules.ts`](rules.ts).

## Ground rule: verify on the desktop web

Only add a param after seeing it yourself in a link copied from the **desktop web** version of the site, with the site's own button ("Share", "Copy link"…) or from the page.

Generic lists (ClearURLs, AdGuard…) are a good source of ideas, but they mix up mobile apps and websites. For instance, Spotify and Reddit add tracking ids from their mobile apps, but not from their websites.

## Add a param to a supported site

1. In `rules.ts`, add the param to the site's `strip`, with a short description of where it comes from:

   ```ts
   strip: {
     si: 'Sharer identifier added by the "Share" button',
     newparam: 'Added by "Copy link" on Shorts',
   },
   ```

2. Add an `examples` entry: the link as copied, then the expected clean link.
3. Run `pnpm test`.

## Add a site

Add an entry to `rules.ts`:

```ts
{
  id: 'instagram',              // stable, stored in users' history: never rename it
  name: 'Instagram',            // shown in the popup
  hosts: ['instagram.com'],     // subdomains are included
  handlers: ['clipboard'],      // how links are intercepted, see handlers/
  strip: {
    igsh: 'Sharer identifier added by "Copy link"',
  },
  examples: [
    ['https://www.instagram.com/p/AbC123/?igsh=xyz', 'https://www.instagram.com/p/AbC123/'],
  ],
},
```

On some pages, no param is ever needed (a post link on X, for example). Use `allowOnly` there: on matching paths, every param not listed is removed, including ones the site adds in the future.

```ts
allowOnly: [{ path: /\/status\/\d+/, params: [] }],
```

Then test it for real: `pnpm dev` (or `pnpm dev:firefox`), copy a link on the site, and check the clipboard and the popup.

## Add a handler

A handler is a way to intercept links. `clipboard` patches the clipboard APIs. Some tracking cannot be reached that way, for instance params in the address bar or links copied with right-click → "Copy link address". Those need a new handler.

1. Create `handlers/<name>.ts` exporting a `Handler` (see `core/types.ts`). It runs in the page's context (MAIN world) at `document_start`, and gets `cleanText()` to clean any supported link found in a text.
2. Register it in `handlers/index.ts`.
3. Reference it by name in the `handlers` of the sites that need it.

Keep in mind that handlers run inside third-party pages: never trust page data, and avoid breaking the site's own behavior.

## Before opening a pull request

```sh
pnpm compile
pnpm test
```

The CI runs both, plus the Chrome and Firefox builds.

Please write code, comments and commit messages in English.
