import { defineConfig } from 'vitepress'

export const shared = defineConfig({
  title: "Doc",
  description: "My doc with vitepress",
  base: '/doc/',
  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['link', { rel: 'icon', href: '/doc/favicon.ico' }],
  ],

  rewrites: {
    'en/:rest*': ':rest*'
  },

  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KevinDeBenedetti' }
    ]
  }

})