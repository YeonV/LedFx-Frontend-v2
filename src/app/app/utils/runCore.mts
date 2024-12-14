/* eslint-disable @typescript-eslint/no-explicit-any */
import * as cp from 'child_process'
import corePath from './corePath.mjs'

const runCore = (file: string, options: any) =>
  cp.spawn(`${corePath(file)}`, options).on('error', (err) => {
    console.error(`Failed to start subprocess. ${err}`)
  })

export default runCore
