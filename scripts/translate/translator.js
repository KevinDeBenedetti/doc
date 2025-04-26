import fs from 'fs'
import path from 'path'
import { translateText } from './apiClient.js'
import { logger } from './logger.js'

/**
 * Checks the markdown structure and adds a date header.
 */
function checkMarkdownStructure(original, translated) {
  const headerRegex = /^---[\s\S]*?---/m
  const origH = (original.match(headerRegex) || []).length
  const transH = (translated.match(headerRegex) || []).length
  if (origH !== transH) {
    logger.warn(
      `Headers mismatch: original(${origH}) vs translated(${transH})`
    )
  }
}

/**
 * Format the date, dd/mm/yyyy
 */
function getCurrentDateFormatted() {
  const d = new Date()
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  return `${dd}/${mm}/${yyyy}`
}

/**
 * Translates a Markdown file and writes the result to a target folder.
 * 
 * @param {string} inputPath - Source file path (.md)
 * @param {string} outputDir - Output directory (ex: '../docs/en')
 * @param {string} lang - Target language code (ex: 'fr')
 */
export async function translateMarkdownFile(inputPath, outputDir, lang) {
  logger.info(`⏳ Translating ${path.basename(inputPath)} → ${lang}`)

  // Read the content
  const content = fs.readFileSync(inputPath, 'utf-8')

  // Translate with the API
  let translated = await translateText(content, lang)

  // Verify the structure
  checkMarkdownStructure(content, translated)

  // Prepare the header with the date
  const header = `<!-- Translated on ${getCurrentDateFormatted()} -->\n\n`
  const final = header + translated

  // Ensure the file exists
  fs.mkdirSync(outputDir, { recursive: true })

  // Write the file
  const outPath = path.join(outputDir, path.basename(inputPath))
  fs.writeFileSync(outPath, final, 'utf-8')
  logger.info(`✅ Saved to ${outPath}`)
}