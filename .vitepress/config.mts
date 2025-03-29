import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Doc",
  description: "My doc with vitepress",
  base: '/doc/',
  head: [
    ['meta', { name: 'robots', content: 'noindex, nofollow' }]
  ],
  themeConfig: {
    socialLinks: [
      { icon: 'github', link: 'https://github.com/KevinDeBenedetti' }
    ]
  },
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Examples', link: '/markdown-examples' }
        ],
    
        sidebar: [
          {
            text: 'Environment & Tools',
            collapsed: true,
            items: [
              { text: 'Git', link: '/en/git/' },
              { text: 'GitHub', link: '/en/github/' },
              { text: 'Docker', link: '/en/docker/' },
              { text: 'Hosting', link: '/en/hosting/' },
            ]
          }
        ],

      },
    },
    fr: {
      label: 'Français',
      lang: 'fr',
      link: '/fr/',
      themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
          { text: 'Accueil', link: '/fr/' },
          { text: 'Exemples', link: '/markdown-examples' }
        ],
    
        sidebar: [
          {
            text: 'Environment & Tools',
            collapsed: true,
            items: [
              { text: 'Git', link: '/fr/git/' },
              { text: 'GitHub', link: '/fr/github/' },
              { text: 'Docker', link: '/fr/docker/' },
              { text: 'Hosting', link: '/fr/hosting/' },
            ]
          }
        ],
    

      },
    }
  }
})
