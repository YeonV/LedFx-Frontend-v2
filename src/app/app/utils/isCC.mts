/* eslint-disable prettier/prettier */
import fs from 'fs'
import corePath from './corePath.mjs'
import coreFile from './coreFile.mjs'

export const isCC = () => {
  return fs.existsSync(
    corePath(coreFile[process.platform as 'darwin' | 'linux' | 'win32'])
  )
}

export default isCC
