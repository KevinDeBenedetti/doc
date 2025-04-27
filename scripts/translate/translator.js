import fs from 'fs'
import path from 'path'
import { parse, stringify } from 'yaml'
import { translateText } from './apiClient.js'
import { logger } from './logger.js'

/**
 * Regex to extract YAML frontmatter
 */
const FRONTMATTER_REGEX = /^(---\n[\s\S]*?\n---)(?:\n?)/

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
 * Ensure a YAML frontmatter string from object
 */
function stringifyFrontmatter(obj) {
  const yamlContent = stringify(obj).trim()
  return `---\n${yamlContent}\n---\n\n`
}

/**
 * Checks the markdown structure and adds a date header.
 */
function checkMarkdownStructure(original, translated) {
  const headerRegex = /^#{1,6}\s+/gm
  const origH = (original.match(headerRegex) || []).length
  const transH = (translated.match(headerRegex) || []).length
  if (origH !== transH) {
    logger.warn(
      `Headers mismatch: original(${origH}) vs translated(${transH})`
    )
  }
}

/**
 * Translates a Markdown file and writes the result to a target folder.
 * 
 * @param {string} inputPath - Source file path (.md)
 * @param {string} outputDir - Output directory (ex: '../docs/en')
 * @param {string} lang - Target language code (ex: 'fr')
 */
export async function translateMarkdownFile(inputPath, outputDir, lang) {
  const filename = path.basename(inputPath)

  // Read the content
  const content = fs.readFileSync(inputPath, 'utf-8')

  // Extract existing frontmatter or initialize
  let existingFM = {}
  let body = content

  const match = content.match(FRONTMATTER_REGEX)

  if (match) {
    try {
      const rawYaml = match[1].slice(4, -4)
      existingFM = parse(rawYaml) || {}
    } catch (err) {
      logger.warn(`Failed to parse frontmatter in ${filename}: ${err.message}`)
    }
    body = content.slice(match[0].length)
    logger.info(`🔍 Body extracted from`)
  }

  const newFM = {
    ...existingFM,
    translated: true,
    translatedDate: getCurrentDateFormatted(),
    verified: false
  }

  const fmString = stringifyFrontmatter(newFM)

  // Translate the body
  const translatedBody = await translateText(body, lang)

  // Verify structure
  checkMarkdownStructure(body, translatedBody)

  // Compose final content
  const finalContent = fmString + translatedBody.trimStart()

  // Write output
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, filename), finalContent, 'utf-8')
  logger.info(`✅ Translated and saved: ${filename}`)
}