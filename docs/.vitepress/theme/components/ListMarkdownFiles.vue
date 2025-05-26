<script setup>
import { ref } from 'vue'

const isDev = import.meta.env.DEV
const selectedFile = ref(null)
const translatedContent = ref('')
const files = isDev ? import.meta.glob('/**/*.md', { as: 'raw', eager: true }) : {}
const filenames = Object.keys(files)

function handleSelect(path) {
  selectedFile.value = path
  translatedContent.value = ''
}

async function translateFile() {
  if (!selectedFile.value) return

  const content = files[selectedFile.value]
  const response = await fetch('http://localhost:3000/traduire', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      content,
      filename: selectedFile.value.split('/').pop()
    }),
  })

  const data = await response.json()
  translatedContent.value = data.translatedContent
}
</script>

<template>
  <div v-if="isDev" class="p-4 max-w-md mx-auto">
    <legend class="text-xl font-semibold mb-3">Choisis un fichier Markdown</legend>
    <div class="flex flex-col gap-3 mb-4">
      <label
        v-for="file in filenames"
        :key="file"
        class="font-medium h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-blue-300 has-[:checked]:ring-1 select-none cursor-pointer"
      >
        <div class="w-5 text-blue-500">
          📄
        </div>
        {{ file.replace(/^\/+/, '') }}
        <input
          type="radio"
          name="selected"
          class="w-4 h-4 absolute accent-blue-500 right-3"
          :value="file"
          v-model="selectedFile"
        />
      </label>
    </div>

    <div class="w-full min-h-20 mt-10 flex items-center justify-center">
      <button
        @click="translateFile"
        :disabled="!selectedFile"
        class="text-xl w-32 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000 cursor-pointer"
      >
        <span
          class="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"
        ></span>
        <span
          class="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
        ></span>
        Button
      </button>
    </div>
    
    <div v-if="translatedContent" class="mt-6">
      <h3 class="font-bold mb-2">Contenu traduit :</h3>
      <pre class="bg-gray-100 p-3 rounded-md whitespace-pre-wrap">{{ translatedContent }}</pre>
    </div>
  </div>

  <div v-else class="p-4 text-gray-500 text-center">
    Cette interface est disponible uniquement en développement.
  </div>
</template>
