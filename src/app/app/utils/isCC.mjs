import fs from 'fs'
import corePath from './corePath.mjs'
import coreFile from './coreFile.mjs'

export const isCC = fs.existsSync(corePath(coreFile[process.platform]))

export default isCC
