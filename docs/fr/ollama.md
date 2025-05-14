---
title: Ollama
description: Guide for setting up your Ollama.
translated: true
translatedDate: 14/05/2025
verified: false
---

```markdown
Please **préserver** exactement tous les marqueurs <!--CODE_n-->, <!--CG_n-->, <!--HEADER_n--> et ne pas les modifier ou les traduire. 
<script setup lang="ts">
import OllamaBrowser from '../.vitepress/theme/components/OllamaBrowser.vue'
</script>

# The Ollama Guide
::: tip
[Documentation officielle](https://github.com/ollama/ollama)
:::

## Ollama API
::: tip
[Documentation officielle](https://github.com/ollama/ollama/blob/main/docs/api.md)
:::

## Ollama JavaScript Library
::: tip
[Documentation officielle](https://github.com/ollama/ollama-js)
:::

::: avertissement
Obligatoire :

- Ollama (local)
```sh
ollama ps
```
- Exécuter un modèle, par exemple gemma3:1b
```sh
ollama run gemma3:1b
```
:::

<OllamaBrowser />
```