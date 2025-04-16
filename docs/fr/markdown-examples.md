<!-- Translated on 16/04/2025 -->

```markdown
# Exemples d'Extensions Markdown

Cette page démontre certaines des extensions Markdown intégrées fournies par VitePress.

## Mise en évidence du code

VitePress fournit la mise en évidence du code alimentée par [Shiki](https://github.com/shikijs/shiki), avec des fonctionnalités supplémentaires telles que l'éclaircissage des lignes :

**Entrée**

````md
```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
````

**Sortie**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
````

## Conteneurs Personnalisés

**Entrée**

```md
::: info
Ceci est une boîte d'informations.
:::

::: tip
Ceci est un conseil.
:::

::: warning
Ceci est un avertissement.
:::

::: danger
Ceci est un avertissement dangereux.
:::

::: details
Ceci est un bloc de détails.
:::
```

**Sortie**

::: info
Ceci est une boîte d'informations.
:::

::: tip
Ceci est un conseil.
:::

::: warning
Ceci est un avertissement.
:::

::: danger
Ceci est un avertissement dangereux.
:::

::: details
Ceci est un bloc de détails.
:::

## Plus

Consultez la documentation pour la [liste complète des extensions Markdown](https://vitepress.dev/guide/markdown).
```