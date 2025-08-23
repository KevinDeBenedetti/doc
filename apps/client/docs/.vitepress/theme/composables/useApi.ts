import { ref } from 'vue'

export function useApi() {
  // States for the API
  const isApiSending = ref(false)
  const apiResponse = ref(null)
  const apiError = ref(null)

  // Function to send the file to the API
  async function sendToApi(
    selectedFile: string | null, 
    files: Record<string, string>,
    sourceLanguage: string = 'en',
    targetLanguage: string = 'fr',
    modelName: string = 'gpt-oss'
  ) {
    if (!selectedFile) return
    
    isApiSending.value = true
    apiResponse.value = null
    apiError.value = null
    
    try {
      // Get the markdown file content
      const fileContent = files[selectedFile]

      console.log('Sending file for translation:', {
        file: selectedFile,
        sourceLanguage,
        targetLanguage,
        modelName
      })
      
      // Create FormData to match the API expectations
      const formData = new FormData()
      
      // Create a file blob from the content
      const fileBlob = new Blob([fileContent], { type: 'text/markdown' })
      const fileName = selectedFile.split('/').pop() || 'document.md'
      formData.append('file', fileBlob, fileName)
      
      // Add other required parameters
      formData.append('source_language', sourceLanguage)
      formData.append('target_language', targetLanguage)
      formData.append('model_name', modelName)
      
      // Send to the API
      const response = await fetch('http://localhost:8000/translate-file', {
        method: 'POST',
        body: formData
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

  // Reset API states when a new file is selected
  function resetApiStates() {
    apiResponse.value = null
    apiError.value = null
  }

  return {
    isApiSending,
    apiResponse,
    apiError,
    sendToApi,
    resetApiStates
  }
}