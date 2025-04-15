const axios = require('axios');
const fs = require('fs');
const path = require('path');

const ollamaBaseUrl = 'http://localhost:11434';
const model = 'gemma3'; // Choose your Ollama model
const defaultLanguage = 'en'; // Choose your default language
// const supportedLanguages = ['fr']; // Choose your supported languages

/**
 * Language precision settings for target languages.
 */
const languageSettings = {
  fr: {
    name: 'French',
    precision: 'Translate to French in a technical and clear style without any introductory commentary or additional explanation'
  }
};

/**
 * Checks the availability of the Ollama API.
 */
async function testOllamaConnection() {
  try {
    const res = await axios.get(`${ollamaBaseUrl}/api/version`);
    console.log("Connected to Ollama API:", res.data);
  } catch (error) {
    console.error("Error connecting to Ollama API:", error.message);
    process.exit(1);
  }
}

/**
 * Sends text to be translated from English to the target language using the generation API.
 * 
 * @param {string} text - The markdown text in English to translate.
 * @param {string} targetLanguage - The target language code, e.g., 'fr'.
 * @returns {Promise<string>} - The translated text.
 */
async function translateText(text, targetLanguage) {
  try {
    const setting = languageSettings[targetLanguage];
    const prompt = `Translate the following markdown text from ${defaultLanguage} to ${setting.name}. ${setting.precision}. Preserve exactly all markdown formatting, including headers, code blocks, and paragraphs, and do not include any extra commentary:\n\n${text}`;
    const response = await axios.post(`${ollamaBaseUrl}/api/generate`, {
      model: model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.2,
        top_p: 0.9,
        repeat_penalty: 1.0
      },
      raw: false,
      keep_alive: '5m'
    });
    console.log("Response:", response.data);
    return response.data.response;
  } catch (error) {
    console.error("Error during translation:", error.message);
    return text;
  }
}

/**
 * Performs a basic check comparing the markdown structure of the original and translated text.
 *
 * @param {string} original - The original markdown content.
 * @param {string} translated - The translated markdown content.
 */
function checkMarkdownStructure(original, translated) {
  const headerRegex = /^#{1,6}\s+/gm;
  const originalHeaders = original.match(headerRegex) || [];
  const translatedHeaders = translated.match(headerRegex) || [];
  if (originalHeaders.length !== translatedHeaders.length) {
    console.warn(`Warning: The number of headers differ. Original: ${originalHeaders.length}, Translated: ${translatedHeaders.length}`);
  } else {
    console.log("Markdown structure verified.");
  }
}

/**
 * Returns the current date formatted as dd/mm/yyyy.
 * 
 * @returns {string} - Formatted date.
 */
function getCurrentDateFormatted() {
  const today = new Date();
  let dd = today.getDate();
  let m = today.getMonth() + 1; // Months are zero-based
  const yyyy = today.getFullYear();
  if (dd < 10) dd = '0' + dd;
  if (m < 10) m = '0' + m;
  return `${dd}/${m}/${yyyy}`;
}

/**
 * Reads a markdown file, translates its content, and saves the result in the target language folder.
 * 
 * Before translating, it checks if the translated file already exists and, if so, whether it contains a
 * verified tag (e.g., "<!-- verified -->"). If the tag is present, the file is skipped.
 *
 * @param {string} filePath - Path to the markdown source file.
 * @param {string} targetLanguage - The target language code (e.g., 'fr').
 */
async function translateMarkdownFile(filePath, targetLanguage) {
  console.log("Processing:", filePath, "->", targetLanguage);
  
  // Destination folder and file path
  const fileName = path.basename(filePath);
  const outputDir = path.join(__dirname, `../docs/${targetLanguage}`);
  const outputPath = path.join(outputDir, fileName);
  
  // If the translated file already exists, check for the verified tag
  if (fs.existsSync(outputPath)) {
    const existingContent = fs.readFileSync(outputPath, 'utf8');
    // Use a regex that allows optional leading whitespace before the verified comment
    const verifiedTagRegex = /^\s*<!--\s*verified\s*-->/im;
    if (verifiedTagRegex.test(existingContent)) {
      console.log(`Skipping already verified file: ${outputPath}`);
      return;
    }
  }

  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check if the source file is marked as verified
  const sourceVerifiedRegex = /^\s*<!--\s*verified\s*-->/im;
  if (sourceVerifiedRegex.test(content)) {
    console.log(`Skipping translation for verified source file: ${filePath}`);
    return;
  }
  
  // Translate the content
  const translatedContent = await translateText(content, targetLanguage);

  // Verify markdown structure
  checkMarkdownStructure(content, translatedContent);

  // Generate header comment with the current date in dd/mm/yyyy format
  const currentDate = getCurrentDateFormatted();
  const headerComment = `<!-- Translated on ${currentDate} -->\n\n`;
  const finalContent = headerComment + translatedContent;

  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, finalContent, 'utf8');
  console.log("Translation saved to:", outputPath);
}

/**
 * Iterates over markdown files in docs/en and translates each file to every supported target language.
 */
async function main() {
  await testOllamaConnection();

  const docsEnDir = path.join(__dirname, '../docs/en');
  const files = fs.readdirSync(docsEnDir);

  for (const file of files) {
    const filePath = path.join(docsEnDir, file);
    if (file.endsWith('.md') && fs.lstatSync(filePath).isFile()) {
      for (const targetLanguage of Object.keys(languageSettings)) {
        await translateMarkdownFile(filePath, targetLanguage);
      }
    }
  }
}

main();
