# Developer Documentation made with `VitePress`

Welcome to my developer documentation, crafted with [`VitePress`](https://vitepress.dev/) to provide a seamless and engaging experience.

## 🎨 Custom Theming

I've implemented a bespoke theme. This customization enhances readability and provides a unique visual experience.

## 🌐 Multilingual Support

The documentation is available in multiple languages.

### Translate content

Translations are executed on a local computer using Ollama, [official repository](https://github.com/ollama/ollama).

```sh
./scripts
└── translate
    ├── apiClient.js
    ├── fileProcessor.js
    ├── index.js
    ├── languageSettings.js
    ├── logger.js
    ├── translate.cjs
    └── translator.js
```

> Run translation on local
```sh
pnpm translate
```

> Validate a file
```html
---
...
verified: default false, update to true after review
---
```
Add this comment on the top of the markdown file.

## ⚙️ Projet

### Start
```bash
pnpm run docs:dev
```