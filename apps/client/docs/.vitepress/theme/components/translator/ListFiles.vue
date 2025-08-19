<script setup>
import { ref, computed } from 'vue'
import LoaderInvader from '../LoaderInvader.vue'

const isDev = import.meta.env.DEV
const selectedFile = ref(null)
const translatedContent = ref('')

// Charge tout le contenu markdown (dev uniquement)
const files = isDev ? import.meta.glob('/**/*.md', { as: 'raw', eager: true }) : {}
const allFilenames = Object.keys(files)

// Détection des fichiers en anglais
const englishFiles = computed(() => {
  return allFilenames.filter(filename => {
    const hasEnInPath = /\/en\//.test(filename)
    const hasEnExtension = filename.endsWith('.en.md')
    const pathParts = filename.split('/')
    const hasEnFolder = pathParts.some(part => part === 'en')
    return hasEnInPath || hasEnExtension || hasEnFolder
  })
})

// Statistiques
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

// Helpers pour l'affichage "tree"
function normalizeForDisplay(filepath) {
  // Chemin lisible: retire leading slash, retire segment en/ s'il existe, simplifie .en.md -> .md
  return filepath
    .replace(/^\/+/, '')
    .replace(/(^|\/)en\//, '$1')
    .replace(/\.en\.md$/, '.md')
}

function buildTree(paths) {
  // Construit un arbre { type: 'dir'|'file', name, children?, fullPath? }
  const root = []
  const byKey = new Map()

  function ensureDir(parentArr, parentKey, name) {
    const key = parentKey ? `${parentKey}/${name}` : name
    let node = byKey.get(key)
    if (!node) {
      node = { type: 'dir', name, children: [], key }
      byKey.set(key, node)
      parentArr.push(node)
    }
    return node
  }

  for (const full of paths) {
    const display = normalizeForDisplay(full)
    const parts = display.split('/').filter(Boolean)
    let current = root
    let parentKey = ''
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]
      const last = i === parts.length - 1
      if (last) {
        current.push({
          type: 'file',
          name: part,
          fullPath: full,
          key: full
        })
      } else {
        const dirNode = ensureDir(current, parentKey, part)
        current = dirNode.children
        parentKey = dirNode.key
      }
    }
  }

  // Tri: dossiers en premier puis fichiers, alpha
  function sortNodes(arr) {
    arr.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'dir' ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    for (const n of arr) {
      if (n.type === 'dir') sortNodes(n.children)
    }
  }
  sortNodes(root)

  return root
}

const englishTree = computed(() => buildTree(englishFiles.value))

function buildTreeLines(nodes, prefixStack = []) {
  const lines = []

  nodes.forEach((node, idx) => {
    const isLast = idx === nodes.length - 1
    const branch = isLast ? '└── ' : '├── '
    const prefix = prefixStack.map(last => (last ? '    ' : '│   ')).join('')

    const lineText = `${prefix}${branch}${node.name}`

    lines.push({
      text: lineText,
      isDir: node.type === 'dir',
      isFile: node.type === 'file',
      fullPath: node.fullPath || null
    })

    if (node.type === 'dir' && node.children?.length) {
      const childLines = buildTreeLines(node.children, [...prefixStack, isLast])
      lines.push(...childLines)
    }
  })

  return lines
}

const treeLines = computed(() => buildTreeLines(englishTree.value))
</script>

<template>
  <div v-if="isDev" class="p-4 max-w-3xl m-auto">
    <!-- Statistiques -->
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

    <!-- Message si aucun fichier anglais -->
    <div v-if="englishFiles.length === 0" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
      <div class="text-yellow-800 font-medium">⚠️ No English files found</div>
      <div class="text-yellow-600 text-sm mt-1">
        Looking for files with '/en/' in path or '.en.md' extension
      </div>
    </div>

    <!-- Arborescence style "tree" -->
    <div v-else class="mb-4 rounded-lg border border-gray-200">
      <div class="px-3 py-2 border-b text-sm text-gray-600 bg-gray-50 rounded-t-lg">
        Tree view (Markdown style)
      </div>
      <div class="p-3 font-mono text-sm whitespace-pre overflow-x-auto">
        <div
          v-for="(line, i) in treeLines"
          :key="i"
          class="flex items-center gap-2 rounded px-1"
          :class="[
            line.isFile && selectedFile === line.fullPath ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' : 'hover:bg-gray-50 dark:hover:bg-gray-700'
          ]"
        >
          <div class="w-5 text-blue-500 select-none">
            <span v-if="line.isDir">📁</span>
            <span v-else>📄</span>
          </div>
          <button
            class="text-left flex-1 cursor-pointer"
            :class="line.isFile ? 'text-blue-600 hover:underline' : 'text-gray-700'"
            :disabled="!line.isFile"
            @click="line.isFile && handleSelect(line.fullPath)"
          >
            {{ line.text }}
          </button>
        </div>
      </div>
    </div>

    <!-- Fichier sélectionné -->
    <div v-if="selectedFile" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="text-green-800 font-medium text-sm">✅ Selected file:</div>
      <div class="text-green-700 text-sm mt-1 font-mono break-all">
        {{ selectedFile.replace(/^\/+/, '') }}
      </div>
    </div>

    <!-- Bouton de traduction -->
    <div class="w-full min-h-20 mt-6 flex items-center justify-center">
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