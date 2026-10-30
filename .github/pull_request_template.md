## What does this change?

<!-- e.g. "Strip `igsh` from Instagram links copied with 'Copy link'" -->

## Checklist

- [ ] Each new param was seen when copying a link on the **desktop web** version of the site (not the mobile app)
- [ ] Each new param has a description in `strip` saying where it comes from
- [ ] `examples` cover the change (copied link → expected clean link)
- [ ] Params needed to open the link (video id, timestamp, playlist…) are kept
- [ ] `pnpm compile` and `pnpm test` pass
