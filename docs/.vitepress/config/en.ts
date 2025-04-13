import { defineConfig, type DefaultTheme } from 'vitepress'

export const en = defineConfig({
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: [
      {
        text: 'Environment & Tools',
        collapsed: true,
        items: [
          { text: 'Git', link: '/git/' },
        ]
      },
      {
        text: 'Frameworks',
        collapsed: true,
        items: [
          { text: 'Nuxt', link: '/nuxt/' },
        ]
      },
    ],
  },
})