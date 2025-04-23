import fs from 'fs'
import path from 'path'
import { translateMarkdownFile } from './translator.js'
import { logger } from './logger.js'

/**
 * Runs through all the documents in a file and translates them.
 * 
 * @param {string} srcDir - Source directory (ex: '../docs/en')
 * @param {string} outRoot - Output root directory (ex: '../docs')
 * @param {string[]} langs - List of language codes (ex: ['fr'])
 */
export async function processDirectory(srcDir, outRoot, langs) {
  const files = fs.readdirSync(srcDir)

  for (const file of files) {
    const filePath = path.join(srcDir, file)
    if (!file.endsWith('.md') || !fs.lstatSync(filePath).isFile()) continue

    for (const lang of langs) {
      const targetDir = path.join(outRoot, lang)
      try {
        await translateMarkdownFile(filePath, targetDir, lang)
      } catch (error) {
        logger.error(
          `❌ Error processing ${file} → ${lang}: ${error.message}`
        )
      }
    }
  }
}