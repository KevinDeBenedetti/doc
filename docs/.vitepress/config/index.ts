import { defineConfig } from 'vitepress'
import { en } from './en'
import { fr } from './fr'
import { shared } from './shared'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  ...shared,
  locales: {
    root: { label: 'English', ...en },
    fr: { label: 'Français', ...fr }
  },
})
