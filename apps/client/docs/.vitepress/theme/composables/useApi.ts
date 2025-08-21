import { ref } from 'vue'

export function useApi() {
  // States for the API
  const isApiSending = ref(false)
  const apiResponse = ref(null)
  const apiError = ref(null)

  // Function to send the file to the API
  async function sendToApi(selectedFile, files) {
    if (!selectedFile) return
    
    isApiSending.value = true
    apiResponse.value = null
    apiError.value = null
    
    try {
      // Get the markdown file content
      const fileContent = files[selectedFile]

      console.log('Sending file:', fileContent)
      
      // Send to the API
      const response = await fetch('/api/markdown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filePath: selectedFile,
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