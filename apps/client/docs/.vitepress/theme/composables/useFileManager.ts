import { ref, computed } from 'vue'

export function useFileManager() {
  const isDev = import.meta.env.DEV
  const selectedFile = ref(null)

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
  }

  return {
    isDev,
    selectedFile,
    files,
    englishFiles,
    handleSelect
  }
}