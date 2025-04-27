# Developer Documentation made with `VitePress`

Welcome to my developer documentation, crafted with [`VitePress`](https://vitepress.dev/) to provide a seamless and engaging experience.

## 🎨 Custom Theming

I've implemented a bespoke theme. This customization enhances readability and provides a unique visual experience.

## 🌐 Multilingual Support

The documentation is available in multiple languages.

### Translate content

Local configuration (macOs, m2, homebrew, pnpm)

#### Use Ollama

> Install Ollama with Homebrew, [link](https://formulae.brew.sh/formula/ollama#default)
```sh
brew install ollama
```
> Run a model (gemma3)
```sh
ollama run gemma3
```
> List models
```sh
ollama list
```

#### Scripts

> Create and copy `/scripts/translate.js`
> Configure your model
```js
...
const model = 'gemma3'; // Choose your Ollama model
...
```
> Configure your languages
```js
...
/**
 * Language precision settings for target languages.
 */
const languageSettings = {
  fr: {
    name: 'French',
    precision: 'Translate to French in a technical and clear style without any introductory commentary or additional explanation'
  },
  ...
};
...
```
> Update `package.json`
```js
...
  "scripts": {
    ...
    "translate": "node scripts/translate.js"
  },
...
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


## Commands for the project

### Start
```bash
pnpm run docs:dev
```