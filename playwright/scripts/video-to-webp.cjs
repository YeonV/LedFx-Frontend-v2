const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const RESULTS_DIR = 'playwright/videos'
const ANIMATED_DIR = 'playwright/animated'

if (!fs.existsSync(ANIMATED_DIR)) {
  fs.mkdirSync(ANIMATED_DIR, { recursive: true })
}

function convertToWebp(videoPath) {
  const fileName = path.basename(videoPath).replace(/\.webm$/, '.webp')
  const outputPath = path.join(ANIMATED_DIR, fileName)

  console.log(`Converting ${videoPath} to ${outputPath}...`)

  try {
    // Basic conversion command for animated webp
    // -vf "fps=10,scale=800:-1:flags=lanczos" reduces size and quality for better sharing
    execSync(
      `ffmpeg -i "${videoPath}" -vf "fps=10,scale=800:-1:flags=lanczos" -vcodec libwebp -lossless 0 -compression_level 6 -q:v 50 -loop 0 -preset default -an -y "${outputPath}"`,
      { stdio: 'inherit' }
    )
    console.log(`✅ Success: ${outputPath}`)
  } catch (e) {
    console.error(`❌ Failed to convert ${videoPath}: ${e.message}`)
  }
}

function findVideos(dir) {
  if (!fs.existsSync(dir)) return

  const files = fs.readdirSync(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    if (fs.statSync(fullPath).isDirectory()) {
      findVideos(fullPath)
    } else if (file.endsWith('.webm')) {
      convertToWebp(fullPath)
    }
  }
}

console.log(`🎬 Looking for Playwright videos in ${RESULTS_DIR}/...\n`)
findVideos(RESULTS_DIR)
console.log('\nDone.')
