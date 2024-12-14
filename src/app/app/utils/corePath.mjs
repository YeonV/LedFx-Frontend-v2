import path from 'path'
import isDev from 'electron-is-dev'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const corePath = (file) =>
  path.join(
    path.dirname(__dirname),
    isDev ? '../extraResources' : '../../extraResources',
    file
  )

export default corePath
