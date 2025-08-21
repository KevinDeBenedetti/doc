<script setup>
import { ref, computed } from 'vue'
import LoaderInvader from '../LoaderInvader.vue'

const isDev = import.meta.env.DEV
const selectedFile = ref(null)

// States for the API
const isApiSending = ref(false)
const apiResponse = ref(null)
const apiError = ref(null)

// Upload markdown content (dev only)
const files = isDev ? import.meta.glob('/**/*.md', { as: 'raw', eager: true }) : {}
const allFilenames = Object.keys(files)

// Detection of English files
const englishFiles = computed(() => {
  return allFilenames.filter(filename => {
    const hasEnInPath = /\/en\//.test(filename)
    const hasEnExtension = filename.endsWith('.en.md')
    const pathParts = filename.split('/')
    const hasEnFolder = pathParts.some(part => part === 'en')
    return hasEnInPath || hasEnExtension || hasEnFolder
  })
})

function handleSelect(path) {
  selectedFile.value = path
  // Init states when a new file is selected
  apiResponse.value = null
  apiError.value = null
}

// Function to send the file to the API
async function sendToApi() {
  if (!selectedFile.value) return
  
  isApiSending.value = true
  apiResponse.value = null
  apiError.value = null
  
  try {
    // Get the markdown file content
    const fileContent = files[selectedFile.value]

    console.log('Sending file:', fileContent)
    
    // Send to the API
    const response = await fetch('/api/markdown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filePath: selectedFile.value,
        content: fileContent
      })
    })
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    apiResponse.value = data
  } catch (error) {
    console.error('Error sending file to API:', error)
    apiError.value = error.message || 'Failed to send file to API'
  } finally {
    isApiSending.value = false
  }
}

// Building the tree structure
function buildTree(paths) {
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
    // Directly integrated normalization
    const display = full
      .replace(/^\/+/, '')
      .replace(/(^|\/)en\//, '$1')
      .replace(/\.en\.md$/, '.md')
      
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

  // Sort: directories first then files, alphabetically
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

    lines.push({
      text: `${prefix}${branch}${node.name}`,
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
    <div v-if="englishFiles.length === 0" class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
      <div class="text-yellow-800 font-medium">⚠️ No English files found</div>
      <div class="text-yellow-600 text-sm mt-1">
        Looking for files with '/en/' in path or '.en.md' extension
      </div>
    </div>

    <!-- Tree-style file structure -->
    <div v-else class="mb-4 rounded-lg border border-gray-200">
      <div class="px-3 py-2 border-b text-sm text-gray-600 bg-gray-50 rounded-t-lg">
        Choose a page to translate 
        <span class="text-sm text-gray-500">({{ englishFiles.length }} files)</span>
      </div>
      <div class="p-3 font-mono text-sm whitespace-pre overflow-x-auto">
        <div
          v-for="(line, i) in treeLines"
          :key="i"
          class="flex items-center gap-2 rounded px-1"
          :class="[
            line.isFile && selectedFile === line.fullPath 
              ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:ring-emerald-700' 
              : 'hover:bg-slate-200 dark:hover:bg-slate-700'
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

    <!-- Selected file -->
    <div v-if="selectedFile" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="text-green-800 font-medium text-sm">✅ Selected file:</div>
      <div class="text-green-700 text-sm mt-1 font-mono break-all">
        {{ selectedFile.replace(/^\/+/, '') }}
      </div>
      
      <!-- Button to send to the API -->
      <div class="mt-4 flex gap-2">
        <button 
          @click="sendToApi" 
          :disabled="isApiSending"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="isApiSending" class="inline-block animate-spin">⟳</span>
          {{ isApiSending ? 'Sending...' : 'Send to API' }}
        </button>
      </div>
    </div>
    
    <!-- API result -->
    <div v-if="apiResponse" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="text-green-800 font-medium text-sm">✅ File sent successfully</div>
      <div class="text-green-700 text-sm mt-1 font-mono break-all">
        {{ typeof apiResponse === 'object' ? JSON.stringify(apiResponse) : apiResponse }}
      </div>
    </div>
    
    <!-- API error -->
    <div v-if="apiError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="text-red-800 font-medium text-sm">❌ Error while sending</div>
      <div class="text-red-700 text-sm mt-1">{{ apiError }}</div>
    </div>
  </div>

  <div v-else class="p-4 text-gray-500 text-center">
    <div class="flex items-center justify-center">
      <LoaderInvader />
    </div>
  </div>

</template>