const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const RESULTS_DIR = 'test-results'

function convertToWebp(videoPath) {
  const outputPath = videoPath.replace(/\.webm$/, '.webp')
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

console.log('🎬 Looking for Playwright videos in test-results/...\n')
findVideos(RESULTS_DIR)
console.log('\nDone.')
