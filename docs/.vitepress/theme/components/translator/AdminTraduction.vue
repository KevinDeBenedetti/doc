<script setup>
import { ref } from 'vue'

const isDev = import.meta.env.DEV
const translatedFiles = ref([])

function handleFiles(event) {
  const files = Array.from(event.target.files)

  files.forEach(async (file) => {
    const content = await file.text()

    const response = await fetch('http://localhost:3000/traduire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, filename: file.name }),
    })

    const data = await response.json()

    translatedFiles.value.push({
      name: file.name,
      content: data.translatedContent,
    })
  })
}
</script>

<template>
  <div v-if="isDev" class="p-6 max-w-4xl mx-auto">
    <div class="max-w-md mx-auto rounded-lg overflow-hidden">
      <div class="w-full p-3">
        <label
          class="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out cursor-pointer"
        >
          <div class="absolute flex flex-col items-center pointer-events-none">
            <img
              alt="File Icon"
              class="mb-3 w-10 h-10"
              src="https://img.icons8.com/dusk/64/000000/file.png"
            />
            <span class="block text-gray-500 font-semibold">Glisser-déposer les fichiers</span>
            <span class="block text-gray-400 font-normal mt-1">ou cliquer pour sélectionner</span>
          </div>

          <!-- Input masqué mais fonctionnel -->
          <input
            type="file"
            accept=".md"
            multiple
            class="h-full w-full opacity-0 cursor-pointer"
            @change="handleFiles"
          />
        </label>
      </div>
    </div>

    <!-- Affichage des fichiers traduits -->
    <div v-for="file in translatedFiles" :key="file.name" class="mt-6 border rounded-lg p-4 bg-white shadow">
      <h3 class="text-lg font-semibold mb-2">{{ file.name }}</h3>
      <pre class="whitespace-pre-wrap text-sm text-gray-800">{{ file.content }}</pre>
    </div>
  </div>
  <div v-else class="p-4 text-gray-500 text-center">
    <div class="flex items-center justify-center">
      <LoaderInvader />
    </div>
  </div>
</template>
