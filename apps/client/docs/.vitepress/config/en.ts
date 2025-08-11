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
          { text: 'Docker', link: '/docker/' },
          { text: 'Git', link: '/git/' },
          { text: 'GitHub', link: '/github/' },
          { text: 'Hosting', link: '/hosting/' },
        ]
      },
      {
        text: 'Frameworks',
        collapsed: true,
        items: [
          { text: 'Nuxt', link: '/nuxt/' },
        ]
      },
      {
        text: 'Artificial Intelligence',
        collapsed: true,
        items: [
          { text: 'Ollama', link: '/ollama/' },
        ]
      }
    ],
  },
})