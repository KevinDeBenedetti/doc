<!-- Translated on 23/04/2025 -->

# Exemples d'Extensions Markdown

Cette page illustre quelques extensions Markdown intégrées par VitePress.

## Highlighting de la Syntax

VitePress fournit le Highlighting de la Syntax alimenté par [Shiki](https://github.com/shikijs/shiki), avec des fonctionnalités supplémentaires comme le soulignement de ligne :

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
```

**Sortie**

```js{4}
export default {
  data () {
    return {
      msg: 'Highlighted!'
    }
  }
}
```

## Conteneurs Personnalisés

**Entrée**

```md
::: info
Ceci est une boîte d'information.
:::

::: tip
Ceci est un point de vente.
:::

::: avertissement
Ceci est un avertissement.
:::

::: danger
Ceci est un avertissement dangereux.
:::

::: détails
Ceci est un bloc de détails.
:::
```

**Sortie**

::: info
Ceci est une boîte d'information.
:::

::: tip
Ceci est un point de vente.
:::

::: avertissement
Ceci est un avertissement.
:::

::: danger
Ceci est un avertissement dangereux.
:::

::: détails
Ceci est un bloc de détails.
:::

## Plus

Consultez la documentation pour la liste complète des extensions Markdown ([https://vitepress.dev/guide/markdown](https://vitepress.dev/guide/markdown)).