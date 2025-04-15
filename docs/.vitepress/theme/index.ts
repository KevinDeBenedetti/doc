// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import './style.css'

import Earth from './components/Earth.vue'
import ScrollTop from './components/ScrollTop.vue'

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      // https://vitepress.dev/guide/extending-default-theme#layout-slots
      'home-features-before': () => h(Earth),
      'layout-bottom': () => h(ScrollTop),
    })
  },
  enhanceApp({ app, router, siteData }) {
    app.component('Earth', Earth),
    app.component('ScrollTop', ScrollTop)
  }
} satisfies Theme
