import * as cp from 'child_process'
import corePath from './corePath.mjs'

const runCore = (file, options) =>
  cp.spawn(`${corePath(file)}`, options).on('error', (err) => {
    console.error(`Failed to start subprocess. ${err}`)
  })

export default runCore
