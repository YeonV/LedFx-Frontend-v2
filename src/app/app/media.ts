import { execFile } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const exePath = path.join(__dirname, 'path_to_dist_folder', 'media.exe')

interface MediaInfo {
  title: string
  artist: string
  album: string
  error?: string
}

execFile(exePath, (error: Error | null, stdout: string, stderr: string) => {
  if (error) {
    console.error(`Error: ${error.message}`)
    return
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`)
    return
  }
  try {
    const mediaInfo: MediaInfo = JSON.parse(stdout)
    if (mediaInfo.error) {
      console.log(mediaInfo.error)
    } else {
      console.log(`Title: ${mediaInfo.title}`)
      console.log(`Artist: ${mediaInfo.artist}`)
      console.log(`Album: ${mediaInfo.album}`)
    }
  } catch (parseError) {
    console.error(`JSON Parse Error: ${(parseError as Error).message}`)
  }
})
