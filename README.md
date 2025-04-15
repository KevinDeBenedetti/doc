# Developer Documentation made with `VitePress`

Welcome to my developer documentation, crafted with [`VitePress`](https://vitepress.dev/) to provide a seamless and engaging experience.

## 🎨 Custom Theming

I've implemented a bespoke theme. This customization enhances readability and provides a unique visual experience.

## 🌐 Multilingual Support

The documentation is available in multiple languages.

### Translate content

Local configuration (macOs, m2, homebrew, pnpm)

#### Ollama on macOS

1. Install Ollama with Homebrew, [link](https://formulae.brew.sh/formula/ollama#default)
```sh
brew install ollama
```
2. Run a model (gemma3)
```sh
ollama run gemma3
```
3. List models
```sh
ollama list
```

#### Scripts

1. Create and copy `/scripts/translate.js`
2. Configure your model
```js
...
const model = 'gemma3'; // Choose your Ollama model
...
```
3. Configure your languages
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
4. Update `package.json`
```js
...
  "scripts": {
    ...
    "translate": "node scripts/translate.cjs"
  },
...
```
5. Run translation on local
```sh
pnpm translate
```
6. Validate a file
```html
<!-- verified -->
```
Add this comment on the top of the markdown file.


## Commands for the project

### Start
```bash
pnpm run docs:dev
```