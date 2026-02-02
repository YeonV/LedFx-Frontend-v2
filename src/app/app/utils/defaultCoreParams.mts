const defaultCoreParams = {
  darwin: {
    instance1: ['-p', '8888', '-p_s', '8889']
  },
  linux: {
    instance1: ['-p', '8888', '-p_s', '8889', '--no-tray']
  },
  win32: {
    instance1: ['-p', '8888', '-p_s', '8889', '--no-tray']
  }
}

export default defaultCoreParams
