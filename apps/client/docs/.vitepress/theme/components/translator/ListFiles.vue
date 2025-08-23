<script setup>
import LoaderInvader from '../LoaderInvader.vue'
import { useFileManager } from '../../composables/useFileManager.ts'
import { useApi } from '../../composables/useApi.ts'
import { useFileTree } from '../../composables/useFileTree.ts'
import { ref } from 'vue'

// Use composables
const { isDev, selectedFile, files, englishFiles, handleSelect } = useFileManager()
const { isApiSending, apiResponse, apiError, sendToApi, resetApiStates } = useApi()
const { treeLines } = useFileTree(englishFiles)

// Translation settings
const sourceLanguage = ref('en')
const targetLanguage = ref('fr')
const modelName = ref('gpt-oss')

// Combined function for file selection
function handleFileSelect(path) {
  handleSelect(path)
  resetApiStates()
}

// Function to send to API
function handleSendToApi() {
  sendToApi(
    selectedFile.value, 
    files, 
    sourceLanguage.value, 
    targetLanguage.value,
    modelName.value
  )
}
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
            @click="line.isFile && handleFileSelect(line.fullPath)"
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
      
      <!-- Translation settings -->
      <div class="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
        <div>
          <label class="block text-sm text-green-800 mb-1">Source language</label>
          <select v-model="sourceLanguage" class="w-full px-2 py-1 border border-green-300 rounded">
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-green-800 mb-1">Target language</label>
          <select v-model="targetLanguage" class="w-full px-2 py-1 border border-green-300 rounded">
            <option value="fr">French</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="de">German</option>
          </select>
        </div>
        <div>
          <label class="block text-sm text-green-800 mb-1">AI Model</label>
          <select v-model="modelName" class="w-full px-2 py-1 border border-green-300 rounded">
            <option value="gpt-oss">GPT-OSS</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
          </select>
        </div>
      </div>
      
      <!-- Button to send to the API -->
      <div class="mt-4 flex gap-2">
        <button 
          @click="handleSendToApi" 
          :disabled="isApiSending"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span v-if="isApiSending" class="inline-block animate-spin">⟳</span>
          {{ isApiSending ? 'Translating...' : 'Translate' }}
        </button>
      </div>
    </div>
    
    <!-- API result -->
    <div v-if="apiResponse" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="text-green-800 font-medium text-sm">✅ Translation successful</div>
      <div class="mt-2">
        <div class="text-green-800 font-medium text-sm">Translated content:</div>
        <div class="mt-1 p-3 bg-white border border-green-200 rounded-lg max-h-60 overflow-y-auto">
          <pre class="text-sm whitespace-pre-wrap">{{ apiResponse.translated_content }}</pre>
        </div>
      </div>
      <div class="mt-2 text-xs text-green-700">
        <div>From: {{ apiResponse.source_language }} → To: {{ apiResponse.target_language }}</div>
        <div>Model used: {{ apiResponse.model_used }}</div>
      </div>
    </div>
    
    <!-- API error -->
    <div v-if="apiError" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <div class="text-red-800 font-medium text-sm">❌ Error while translating</div>
      <div class="text-red-700 text-sm mt-1">{{ apiError }}</div>
    </div>
  </div>

  <div v-else class="p-4 text-gray-500 text-center">
    <div class="flex items-center justify-center">
      <LoaderInvader />
    </div>
  </div>
</template>