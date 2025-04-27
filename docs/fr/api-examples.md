---
outline: deep
translated: true
translatedDate: 27/04/2025
verified: true
---

# Exemples d'API Runtime

Cette page illustre l'utilisation de certaines API Runtime fournies par VitePress.

L'API principale `useData()` peut être utilisée pour accéder aux données du site, de la thématique et de la page actuelle. Elle fonctionne dans les fichiers `.md` et `.vue`.

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Résultats

### Données de Thématique
<pre>{{ theme }}</pre>

### Données de Page
<pre>{{ page }}</pre>

### Données de Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Résultats

### Données de Thématique
<pre>{{ theme }}</pre>

### Données de Page
<pre>{{ page }}</pre>

### Données de Frontmatter
<pre>{{ frontmatter }}</pre>

## Plus

Consultez la documentation pour la liste complète des API Runtime [ici](https://vitepress.dev/reference/runtime-api#usedata).
