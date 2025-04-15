---
title: Nuxt
description: Guide pour configurer son projet Nuxt.
---

# Le guide Nuxt

::: info
[Module Nuxt](https://nuxt.com/modules/seo)<br>
[SEO](https://nuxtseo.com/)
:::

<Badge type="tip" text="@nuxtjs/sitemap" /> : Génère automatiquement un sitemap XML pour aider les moteurs de recherche à indexer les pages.
<br>
<br>
<Badge type="tip" text="@nuxtjs/robots" /> : Crée un fichier robots.txt pour gérer l’accès des robots d’indexation.
<br>
<br>
<Badge type="tip" text="nuxt-schema-org" /> : Intègre facilement des balises de schéma JSON-LD pour enrichir les résultats de recherche.
<br>
<br>
<Badge type="tip" text="nuxt-seo-experiments" /> : Permet d’expérimenter différentes optimisations SEO.
<br>
<br>
<Badge type="tip" text="nuxt-og-image" /> : Génère des images pour les aperçus sociaux.
<br>
<br>
<Badge type="tip" text="nuxt-link-checker" /> : Vérifie la validité des liens pour éviter les erreurs 404.
<br>

Ce guide vous montre comment configurer le SEO dans un projet Nuxt en utilisant différents modules populaires pour optimiser la visibilité de votre site dans les moteurs de recherche.

## Installation des modules SEO

### Installation de base

Installez le module SEO en exécutant la commande suivante dans votre terminal :

```sh
npx nuxi@latest module add seo
```

Cela installe les modules SEO pour Nuxt et vous donne accès à une base solide pour optimiser votre site.

### Configuration de base

Configurez les informations de base de votre site dans `nuxt.config.ts` :

```typescript
export default defineNuxtConfig({
  site: {
    url: 'https://www.example.com',
    name: 'An example name for my site.',
  },
});
```

- url : L’URL de base de votre site pour générer les liens et métadonnées.
- name : Nom de votre site qui sera utilisé dans les balises méta et partages sociaux.