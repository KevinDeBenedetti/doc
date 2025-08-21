<script setup>
import LoaderInvader from '../LoaderInvader.vue'
import { useFileManager } from '../../composables/useFileManager.ts'
import { useApi } from '../../composables/useApi.ts'
import { useFileTree } from '../../composables/useFileTree.ts'

// Use composables
const { isDev, selectedFile, files, englishFiles, handleSelect } = useFileManager()
const { isApiSending, apiResponse, apiError, sendToApi, resetApiStates } = useApi()
const { treeLines } = useFileTree(englishFiles)

// Combined function for file selection
function handleFileSelect(path) {
  handleSelect(path)
  resetApiStates()
}

// Function to send to API
function handleSendToApi() {
  sendToApi(selectedFile.value, files)
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
      
      <!-- Button to send to the API -->
      <div class="mt-4 flex gap-2">
        <button 
          @click="handleSendToApi" 
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