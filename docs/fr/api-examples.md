<!-- Translated on 26/04/2025 -->

---
outline: deep
---

# API d'utilisation Runtime

Cette page illustre l'utilisation de certaines API Runtime fournies par VitePress.

L'API principale `useData()` peut être utilisée pour accéder aux données du site, de la thématique et de la page actuelles. Elle fonctionne dans les fichiers `.md` et `.vue`.

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Résultats

### Données de la Thématique
<pre>{{ theme }}</pre>

### Données de la Page
<pre>{{ page }}</pre>

### Données de la Page Frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Résultats

### Données de la Thématique
<pre>{{ theme }}</pre>

### Données de la Page
<pre>{{ page }}</pre>

### Données de la Page Frontmatter
<pre>{{ frontmatter }}</pre>

## Plus

Consultez la documentation pour la liste complète des API Runtime [ici](https://vitepress.dev/reference/runtime-api#usedata).
