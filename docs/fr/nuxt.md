---
title: Nuxt
description: Guide for setting up your Nuxt project.
translated: true
translatedDate: 27/04/2025
verified: false
---

# Le Guide Nuxt

::: info
[Module Nuxt](https://nuxt.com/modules/seo)<br>
[SEO](https://nuxtseo.com/)
:::

<Badge type="tip" text="@nuxtjs/sitemap" /> : Génère automatiquement un sitemap XML pour aider les moteurs de recherche à indexer vos pages.
<br>
<br>
<Badge type="tip" text="@nuxtjs/robots" /> : Crée un fichier robots.txt pour gérer l'accès des robots d'exploration.
<br>
<br>
<Badge type="tip" text="nuxt-schema-org" /> : Intègre facilement les balises JSON-LD schema pour améliorer les résultats de recherche.
<br>
<br>
<Badge type="tip" text="nuxt-seo-experiments" /> : Permet d'expérimenter avec diverses optimisations SEO.
<br>
<br>
<Badge type="tip" text="nuxt-og-image" /> : Génère des images pour les aperçus des réseaux sociaux.
<br>
<br>
<Badge type="tip" text="nuxt-link-checker" /> : Vérifie la validité des liens pour éviter les erreurs 404.
<br>

Ce guide vous montre comment configurer le SEO dans un projet Nuxt en utilisant divers modules populaires pour optimiser la visibilité de votre site sur les moteurs de recherche.

## Installation des Modules SEO

### Installation de Base

Installez le module SEO en exécutant la commande suivante dans votre terminal :

```sh
npx nuxi@latest module add seo
```