import { defineConfig } from 'wxt';

// See https://wxt.dev/api/reference/wxt/interfaces/inlineconfig.html
export default defineConfig({
  manifestVersion: 3,
  manifest: {
    name: 'X-Clear-URLs',
    permissions: ['storage'],
    browser_specific_settings: {
      gecko: {
        id: 'x-clear-urls@example.org',
        data_collection_permissions: {
          required: ['none'],
        },
      },
    },
  },
});
