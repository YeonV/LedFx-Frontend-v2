import * as path from 'path'
import * as fs from 'fs'
import { app } from 'electron'

export function createLedfxFolder() {
  const userDataPath = app.getPath('userData')
  const ledfxFolderPath = path.join(userDataPath, '.ledfx-cc')
  if (!fs.existsSync(ledfxFolderPath)) {
    console.log('Creating .ledfx-cc folder')
    fs.mkdirSync(ledfxFolderPath)
  }
}

export default createLedfxFolder
