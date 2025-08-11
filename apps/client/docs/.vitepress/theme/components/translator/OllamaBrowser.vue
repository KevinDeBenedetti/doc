<script setup>
import { ref, computed } from 'vue'
import ollama from 'ollama/browser'
import { marked } from 'marked'
import LoaderInvader from '../LoaderInvader.vue'

const isDev = import.meta.env.DEV
const prompt = ref('')
const response = ref('')
const loading = ref(false)

const rendered = computed(() => marked(response.value))

async function askOllama() {
  if (!prompt.value.trim()) return

  loading.value = true
  response.value = ''

  try {
    const res = await ollama.chat({
      model: 'gemma3:1b',
      messages: [{ role: 'user', content: prompt.value }],
    })

    response.value = res.message.content
  } catch (error) {
    console.error('Error:', error)
    response.value = '❌ Error fething response : ' + error.message
  } finally {
    loading.value = false
  }

}
</script>

<template>
  <div v-if="isDev" class="max-w-xl mx-auto p-6 border border-gray-200 dark:border-gray-700 rounded-xl transition-colors">
    <input
      v-model="prompt"
      @keyup.enter="askOllama"
      placeholder="Type your prompt here…"
      class="w-full px-4! py-2! mb-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition"
    />

    <button
      @click="askOllama"
      :disabled="loading"
      class="inline-flex items-center px-8! py-2! bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-700 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 dark:focus:ring-indigo-300 disabled:opacity-50 transition"
    >
      <span v-if="loading" class="animate-pulse">⏳ Loading…</span>
      <span v-else>Ask Ollama</span>
    </button>

    <div
      v-if="response"
      v-html="rendered"
      class="mt-6 prose prose-indigo dark:prose-invert border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors"
    />
  </div>
  <div v-else class="p-4 text-gray-500 text-center">
    <div class="flex items-center justify-center">
      <LoaderInvader />
    </div>
  </div>
</template>
