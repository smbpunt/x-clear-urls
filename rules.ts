import { defineRules } from '@/core/rules';

/**
 * Supported sites and the tracking params removed from their links.
 * Only list params that actually show up when copying a link on the desktop web version.
 * See CONTRIBUTING.md.
 */
export const rules = defineRules([
  {
    id: 'x',
    name: 'X',
    hosts: ['x.com', 'twitter.com'],
    handlers: ['clipboard'],
    strip: {
      a: 'Share token added by "Copy link" when logged in',
      s: 'Legacy share source (`?s=20`)',
      t: 'Legacy share token',
      cn: 'Email / notification campaign',
      src: 'Referral source',
      ref_src: 'Referral source (embeds)',
      ref_url: 'Referring page (embeds)',
    },
    // A post link needs no params: drop them all to keep up with X's changes.
    allowOnly: [{ path: /\/status\/\d+/, params: [] }],
    examples: [
      ['https://x.com/jack/status/20?s=20&t=AbCdEf', 'https://x.com/jack/status/20'],
      ['https://x.com/jack/status/20?a=xyz', 'https://x.com/jack/status/20'],
      ['https://twitter.com/jack?ref_src=twsrc%5Etfw', 'https://twitter.com/jack'],
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    hosts: ['youtube.com', 'youtu.be'],
    handlers: ['clipboard'],
    // `v`, `t`, `list` and `index` are needed for playback and are kept.
    strip: {
      si: 'Sharer identifier added by the "Share" button',
      pp: 'Encoded playback context',
      feature: 'Share entry point',
      kw: 'Search keyword',
      gclid: 'Google Ads click ID',
    },
    examples: [
      ['https://youtu.be/dQw4w9WgXcQ?si=AbCdEf123', 'https://youtu.be/dQw4w9WgXcQ'],
      [
        'https://youtu.be/dQw4w9WgXcQ?si=AbCdEf123&t=42',
        'https://youtu.be/dQw4w9WgXcQ?t=42',
      ],
      [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123&pp=ygUFaGVsbG8%3D',
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=PL123',
      ],
    ],
  },
]);
