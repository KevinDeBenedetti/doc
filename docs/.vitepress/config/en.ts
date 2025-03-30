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
          { text: 'GitHub', link: '/github/' },
          { text: 'Docker', link: '/docker/' },
          { text: 'Hosting', link: '/hosting/' },
        ]
      },
      {
        text: 'Frameworks',
        collapsed: true,
        items: [
          { text: 'Vue', link: '/vue/' },
          { text: 'Nuxt', link: '/nuxt/' },
          { text: 'FastAPI', link: '/fastapi/' },
          { text: 'Express', link: '/express/' },
        ]
      },
      {
        text: 'Systems',
        collapsed: true,
        items: [
          { text: 'MacOS', link: '/macos/' },
          { text: 'Debian', link: '/debian/' },
          { text: 'Ubuntu', link: '/ubuntu/' },
        ]
      }
    ],
  },
})