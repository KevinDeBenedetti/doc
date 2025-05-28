<script setup>
import { ref, computed } from 'vue'
import LoaderInvader from '../LoaderInvader.vue'

const isDev = import.meta.env.DEV
const selectedFile = ref(null)
const translatedContent = ref('')
const files = isDev ? import.meta.glob('/**/*.md', { as: 'raw', eager: true }) : {}
const allFilenames = Object.keys(files)

// Filtrer les fichiers anglais
const englishFiles = computed(() => {
  return allFilenames.filter(filename => {
    // Méthode 1: Recherche par pattern /en/ dans le chemin
    const hasEnInPath = /\/en\//.test(filename)
    
    // Méthode 2: Extension .en.md
    const hasEnExtension = filename.endsWith('.en.md')
    
    // Méthode 3: Dossier commençant par 'en'
    const pathParts = filename.split('/')
    const hasEnFolder = pathParts.some(part => part === 'en')
    
    return hasEnInPath || hasEnExtension || hasEnFolder
  })
})

// Statistiques pour debug
const stats = computed(() => ({
  total: allFilenames.length,
  english: englishFiles.value.length,
  other: allFilenames.length - englishFiles.value.length
}))

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

// Fonction pour extraire un nom de fichier plus propre
function getDisplayName(filepath) {
  return filepath
    .replace(/^\/+/, '') // Enlève les slashes du début
    .replace(/\.en\.md$/, '.md') // Simplifie l'extension si .en.md
    .replace(/\/en\//, '/') // Simplifie le chemin si /en/
}

// Fonction pour détecter la méthode de détection utilisée
function getLanguageMethod(filepath) {
  if (filepath.includes('/en/')) return 'folder'
  if (filepath.endsWith('.en.md')) return 'extension'
  return 'other'
}
</script>

<template>
  <div v-if="isDev" class="p-4 max-w-md m-auto">
    <!-- Statistiques de debug -->
    <div class="mb-4 p-3 bg-blue-50 rounded-lg text-sm">
      <div class="font-semibold text-blue-800 mb-1">Files Statistics:</div>
      <div class="text-blue-600">
        📊 Total: {{ stats.total }} | 
        🇬🇧 English: {{ stats.english }} | 
        🌍 Other: {{ stats.other }}
      </div>
    </div>

    <legend class="text-xl font-semibold mb-3">
      Choose an English page to translate 
      <span class="text-sm text-gray-500">({{ englishFiles.length }} files)</span>
    </legend>

    <!-- Message si aucun fichier anglais trouvé -->
    <div v-if="englishFiles.length === 0" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
      <div class="text-yellow-800 font-medium">⚠️ No English files found</div>
      <div class="text-yellow-600 text-sm mt-1">
        Looking for files with '/en/' in path or '.en.md' extension
      </div>
    </div>

    <!-- Liste des fichiers anglais -->
    <div v-else class="flex flex-col gap-3 mb-4 max-h-96 overflow-y-auto">
      <label
        v-for="file in englishFiles"
        :key="file"
        class="font-medium min-h-14 relative hover:bg-zinc-100 flex items-center px-3 gap-3 rounded-lg has-[:checked]:text-blue-500 has-[:checked]:bg-blue-50 has-[:checked]:ring-blue-300 has-[:checked]:ring-1 select-none cursor-pointer"
      >
        <div class="w-5 text-blue-500 flex-shrink-0">
          🇬🇧
        </div>
        <div class="flex-1 min-w-0">
          <div class="truncate">{{ getDisplayName(file) }}</div>
          <div class="text-xs text-gray-500 mt-1">
            <span class="inline-block px-2 py-0.5 bg-gray-100 rounded text-xs">
              {{ getLanguageMethod(file) === 'folder' ? '📁 /en/' : '📄 .en.md' }}
            </span>
          </div>
        </div>
        <input
          type="radio"
          name="selected"
          class="w-4 h-4 absolute accent-blue-500 right-3 flex-shrink-0"
          :value="file"
          v-model="selectedFile"
        />
      </label>
    </div>

    <!-- Fichier sélectionné -->
    <div v-if="selectedFile" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="text-green-800 font-medium text-sm">✅ Selected file:</div>
      <div class="text-green-700 text-sm mt-1 font-mono break-all">
        {{ selectedFile.replace(/^\/+/, '') }}
      </div>
    </div>

    <!-- Bouton de traduction -->
    <div class="w-full min-h-20 mt-10 flex items-center justify-center">
      <button
        @click="translateFile"
        :disabled="!selectedFile"
        class="text-xl w-40 h-12 rounded bg-emerald-500 text-white relative overflow-hidden group z-10 hover:text-white duration-1000 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <span
          class="absolute bg-emerald-600 w-36 h-36 rounded-full group-hover:scale-100 scale-0 -z-10 -left-2 -top-10 group-hover:duration-500 duration-700 origin-center transform transition-all"
        ></span>
        <span
          class="absolute bg-emerald-800 w-36 h-36 -left-2 -top-10 rounded-full group-hover:scale-100 scale-0 -z-10 group-hover:duration-700 duration-500 origin-center transform transition-all"
        ></span>
        Translate
      </button>
    </div>
    
    <!-- Contenu traduit -->
    <div v-if="translatedContent" class="mt-6">
      <h3 class="font-bold mb-2">Contenu traduit :</h3>
      <pre class="bg-gray-100 p-3 rounded-md whitespace-pre-wrap text-sm max-h-96 overflow-y-auto">{{ translatedContent }}</pre>
    </div>
  </div>

  <div v-else class="p-4 text-gray-500 text-center">
    <div class="flex items-center justify-center">
      <LoaderInvader />
    </div>
  </div>
</template>