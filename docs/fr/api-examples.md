<!-- Translated on 15/04/2025 -->

```markdown
# Exemples d'API d'exécution

Cette page démontre l'utilisation de certaines des API d'exécution fournies par VitePress.

L'API principale `useData()` peut être utilisée pour accéder aux données du site, du thème et de la page pour la page actuelle. Elle fonctionne dans les fichiers `.md` et `.vue` :

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Résultats

### Données du thème
<pre>{{ theme }}</pre>

### Données de la page
<pre>{{ page }}</pre>

### Données de la page frontmatter
<pre>{{ frontmatter }}</pre>
```

<script setup>
import { useData } from 'vitepress'

const { site, theme, page, frontmatter } = useData()
</script>

## Résultats

### Données du thème
<pre>{{ theme }}</pre>

### Données de la page
<pre>{{ page }}</pre>

### Données de la page frontmatter
<pre>{{ frontmatter }}</pre>

## Plus d'informations

Consultez la documentation pour la [liste complète des API d'exécution](https://vitepress.dev/reference/runtime-api#usedata).
```