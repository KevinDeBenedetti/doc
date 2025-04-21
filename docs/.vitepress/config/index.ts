import { defineConfig } from 'vitepress'
import { en } from './en'
import { fr } from './fr'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Runes Doc",
  description: "My doc with vitepress",

  base: '/doc/',

  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }],
    ['link', { rel: 'icon', href: '/doc/favicon.ico' }],
  ],

  // To keep the same URL for both languages
  rewrites: {
    'en/:rest*': ':rest*'
  },

  themeConfig: {
    search: {
      provider: 'local',
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KevinDeBenedetti' }
    ]
  },

  locales: {
    root: { label: 'English', ...en },
    fr: { label: 'Français', ...fr }
  },
})
