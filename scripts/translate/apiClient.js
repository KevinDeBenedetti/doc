import axios from 'axios'
import { languageSettings } from './languageSettings.js'

const ollamaBaseUrl = 'http://localhost:11434'
const model = 'gemma3:1b'
const defaultLanguage = 'en'

export async function testOllamaConnection() {
  const res = await axios.get(`${ollamaBaseUrl}/api/version`)
  console.log("Connected to Ollama API:", res.data)
}

export async function translateText(text, targetLanguage) {
  const setting = languageSettings[targetLanguage]
  const prompt = `Translate the following markdown text from ${defaultLanguage} to ${setting.name}. ${setting.precision}. Preserve exactly all markdown formatting, including headers, code blocks, and paragraphs, and do not include any extra commentary:\n\n${text}`
  const response = await axios.post(`${ollamaBaseUrl}/api/generate`, {
    model,
    prompt,
    stream: false,
    options: { temperature: 0.2, top_p: 0.9, repeat_penalty: 1.0 },
    raw: false,
    keep_alive: '5m'
  });
  return response.data.response 
}
