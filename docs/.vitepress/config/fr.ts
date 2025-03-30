import { defineConfig, type DefaultTheme } from 'vitepress'

export const fr = defineConfig({
  themeConfig: {
    nav: [
      { text: 'Home', link: '/fr/' },
      { text: 'Examples', link: '/fr/markdown-examples' }
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
    ]
  },
})
