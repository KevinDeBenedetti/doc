import fs from 'fs'
import path from 'path'
import { parse } from 'yaml'
import { translateMarkdownFile } from './translator.js'
import { logger } from './logger.js'
import { log } from 'console'

/**
 * Regex to extract YAML frontmatter
 */
const FRONTMATTER_REGEX = /^(---\n[\s\S]*?\n---)(?:\n?)/

/**
 * Runs through all the documents in a file and translates them.
 * 
 * @param {string} srcDir - Source directory (ex: '../docs/en')
 * @param {string} outRoot - Output root directory (ex: '../docs')
 * @param {string[]} langs - List of language codes (ex: ['fr'])
 */
export async function processDirectory(srcDir, outRoot, langs) {
  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'))
  for (const file of files) {
    const filePath = path.join(srcDir, file)

    // console.log(`Processing file: ${filePath}`)
    for (const lang of langs) {
      const outDir = path.join(outRoot, lang)
      const outPath = path.join(outDir, file)

      let skip = false
      // logger.info(`⚠️ Out DIR : ${outDir}`)
      // logger.info(fs.existsSync(outPath))

      
      if (fs.existsSync(outPath)) {
        const content = fs.readFileSync(outPath, 'utf-8')
        const match = content.match(FRONTMATTER_REGEX)

        if (match) {
          try {
            const rawYaml = match[1].slice(4, -4)
            const existingFM = parse(rawYaml) || {}
            if (existingFM.verified === true) {
              logger.info(`⏭️  ${lang}/${file} déjà vérifié, on skip.`)
              skip = true
            }
          } catch (error) {
            logger.warn(`⚠️  Erreur de parsing frontmatter ${lang}/${file} : ${err.message}`)
          }
        }
      }

      if (skip) continue

      try {
        // logger.info(`⏳ Translating ${file} → ${lang}`)
        await translateMarkdownFile(filePath, outDir, lang)
      } catch (error) {
        logger.error(
          `❌ Error processing ${file} → ${lang}: ${error.message}`
        )
      }
      // const targetDir = path.join(outRoot, lang)
    }
  }
}