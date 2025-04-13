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
          { text: 'Git', link: '/fr/git/' },
        ]
      },
      {
        text: 'Frameworks',
        collapsed: true,
        items: [
          { text: 'Nuxt', link: '/fr/nuxt/' },
        ]
      }
    ]
  },
})
