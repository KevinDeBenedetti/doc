import fs from 'fs'
import path from 'path'
import { parse, stringify } from 'yaml'
import { translateText } from './apiClient.js'
import { logger } from './logger.js'
import { marked } from 'marked'

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
  const origTokens = marked.lexer(original)
  const transTokens = marked.lexer(translated)

  const origH = origTokens.filter(t => t.type === 'heading').length
  const transH = transTokens.filter(t => t.type === 'heading').length

  // const headerRegex = /^#{1,6}\s+/gm
  // const origH = (original.match(headerRegex) || []).length
  // const transH = (translated.match(headerRegex) || []).length

  if (origH !== transH) {
    logger.warn(
      `Headers mismatch: original(${origH}) vs translated(${transH})`
    )
  }
}

/**
 * 1. Mask all fenced code blocks (```…```)
 */
function maskCodeBlocks(text) {
  const codeBlocks = []
  const masked = text.replace(/```[\s\S]*?```/g, match => {
    const idx = codeBlocks.length
    codeBlocks.push(match)
    return `<!--CODE_${idx}-->`
  })
  return { masked, codeBlocks }
}

/**
 * 2. Mask custom code-group containers (::: code-group … :::)
 */
function maskCodeGroups(text) {
  const groups = []
  const masked = text.replace(/^::: *code-group[\s\S]*?^:::/gim, match => {
    const idx = groups.length
    groups.push(match)
    return `<!--CG_${idx}-->`
  })
  return { masked, groups }
}

/**
 * 3. Mask Markdown headers (# …)
 */
function maskHeaders(text) {
  const headers = []
  const masked = text.replace(/^#{1,6}\s.*$/gm, (match) => {
    const idx = headers.length
    headers.push(match)
    return `<!--HEADER_${idx}-->`
  })
  return { masked, headers }
}

/**
 * Unmask placeholders in reverse order
 */
function unmaskHeaders(text, headers) {
  return text.replace(/<!--HEADER_(\d+)-->/g, (_, i) => headers[+i])
}

function unmaskCodeGroups(text, groups) {
  return text.replace(/<!--CG_(\d+)-->/g, (_, i) => groups[+i])
}

function unmaskCodeBlocks(text, codeBlocks) {
  return text.replace(/<!--CODE_(\d+)-->/g, (_, i) => codeBlocks[+i])
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

  // 1) Mask blocks & headers
  const { masked: m1, codeBlocks } = maskCodeBlocks(body)
  const { masked: m2, groups } = maskCodeGroups(m1)
  const { masked: m3, headers } = maskHeaders(m2)

  // 2) Prompt with preservation directive
  const prompt = `Please **preserve** exactly all placeholders <!--CODE_n-->, <!--CG_n-->, <!--HEADER_n--> and do not modify or translate them. ${m3}`


  // 3. Translate masked Markdown
  const translatedMasked = await translateText(prompt, lang)

  // 4. Unmask in reverse
  let temp = unmaskHeaders(translatedMasked, headers)
  temp = unmaskCodeGroups(temp, groups)
  const finalBody = unmaskCodeBlocks(temp, codeBlocks)

  // 5. Verify structure
  checkMarkdownStructure(body, finalBody)

  // Write output
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(
    path.join(outputDir, filename), 
    // finalContent,
    fmString + finalBody.trimStart(),
    'utf-8'
  )
  logger.info(`✅ Translated and saved: ${filename}`)
}