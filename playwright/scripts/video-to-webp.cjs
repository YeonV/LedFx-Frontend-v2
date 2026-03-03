const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const RESULTS_DIR = 'playwright/videos'
const REPORT_DATA_DIR = 'playwright-report/data'
const ANIMATED_DIR = 'playwright/animated'
const SKIP_SECONDS = 7 // cut the setup/connection noise from the start of every recording

if (!fs.existsSync(ANIMATED_DIR)) {
  fs.mkdirSync(ANIMATED_DIR, { recursive: true })
}

/** Trim the first SKIP_SECONDS from a .webm in-place (frame-accurate, re-encodes video stream) */
function trimVideo(videoPath) {
  const tmp = videoPath + '.trimmed.webm'
  try {
    // Output-side -ss is frame-accurate (unlike input-side fast-seek + stream copy)
    execSync(
      `ffmpeg -i "${videoPath}" -ss ${SKIP_SECONDS} -vcodec libvpx-vp9 -an -y "${tmp}"`,
      { stdio: 'pipe' }
    )
    fs.renameSync(tmp, videoPath)
    console.log(`✂️  Trimmed ${SKIP_SECONDS}s from ${path.basename(videoPath)}`)
  } catch (e) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
    // Try simpler fallback: copy streams, keyframe-aligned (faster, less accurate)
    try {
      execSync(
        `ffmpeg -ss ${SKIP_SECONDS} -i "${videoPath}" -c copy -y "${tmp}"`,
        { stdio: 'pipe' }
      )
      fs.renameSync(tmp, videoPath)
      console.log(`✂️  Trimmed (keyframe) ${SKIP_SECONDS}s from ${path.basename(videoPath)}`)
    } catch (e2) {
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp)
      console.error(`❌ Failed to trim ${videoPath}: ${e2.message}`)
    }
  }
}

function convertToWebp(videoPath) {
  // Playwright always names recordings "video.webm" inside a unique subdirectory.
  // Use the parent directory name so each test gets its own output file.
  const dirName = path.basename(path.dirname(videoPath))
  const fileName = (dirName !== '.' ? dirName : path.basename(videoPath).replace(/\.webm$/, '')) + '.webp'
  const outputPath = path.join(ANIMATED_DIR, fileName)

  console.log(`Converting ${videoPath} to ${outputPath}...`)

  try {
    // -ss before -i = fast input seek (already trimmed, so offset is 0 here)
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
      trimVideo(fullPath)
      convertToWebp(fullPath)
    }
  }
}

console.log(`🎬 Looking for Playwright videos in ${RESULTS_DIR}/...\n`)
findVideos(RESULTS_DIR)

console.log(`\n🎬 Trimming report videos in ${REPORT_DATA_DIR}/...\n`)
if (fs.existsSync(REPORT_DATA_DIR)) {
  const reportFiles = fs.readdirSync(REPORT_DATA_DIR)
  for (const file of reportFiles) {
    if (file.endsWith('.webm')) {
      trimVideo(path.join(REPORT_DATA_DIR, file))
    }
  }
} else {
  console.log(`  (${REPORT_DATA_DIR} not found, skipping)`)
}

console.log('\nDone.\n')
console.log('To open last HTML report run:\n')
console.log('  yarn playwright show-report\n')
