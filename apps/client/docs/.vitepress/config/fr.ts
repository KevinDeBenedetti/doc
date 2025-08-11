import { defineConfig, type DefaultTheme } from 'vitepress'

export const fr = defineConfig({
  themeConfig: {
    nav: [
      { text: 'Accueil', link: '/fr/' },
    ],

    sidebar: [
      {
        text: 'Environment & Tools',
        collapsed: true,
        items: [
          { text: 'Docker', link: '/fr/docker/' },
          { text: 'Git', link: '/fr/git/' },
          { text: 'GitHub', link: '/fr/github/' },
          { text: 'Hosting', link: '/fr/hosting/' },
        ]
      },
      {
        text: 'Frameworks',
        collapsed: true,
        items: [
          { text: 'Nuxt', link: '/fr/nuxt/' },
        ]
      },
      {
        text: 'Intelligence Artificielle',
        collapsed: true,
        items: [
          { text: 'Ollama', link: '/ollama/' },
        ]
      }
    ]
  },
})
