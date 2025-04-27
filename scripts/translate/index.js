import path from 'path'
import { fileURLToPath } from 'url'
import { testOllamaConnection } from './apiClient.js'
import { logger } from './logger.js'
import { processDirectory } from './fileProcessor.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const defaultLanguage = 'en'

async function main() {
  logger.info("🚀 Starting translation process")
  await testOllamaConnection()

  const srcDir = path.join(__dirname, `../../docs/${defaultLanguage}`)
  const outRoot = path.join(__dirname, '../../docs')
  const languages = Object.keys((await import('./languageSettings.js')).languageSettings)

  await processDirectory(srcDir, outRoot, languages)

  logger.info("🎉 All done!")
}

main().catch(err => {
  logger.error("Fatal error in main:", err)
  process.exit(1)
})