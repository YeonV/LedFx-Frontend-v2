const { startCore, coreParams } = require('./core')

const poll = async (wind, subprocesses, name, p) => {
  console.log('Polling core', name, 'on port', p)
  if (!p) return
  try {
    const response = await fetch(`http://127.0.0.1:${p}/api/info`)
    const data = await response.json()
    sendStatus(wind, subprocesses, true, name)
    console.log('Polling core succeeded')
  } catch (err) {
    console.log('Polling core ...')
    setTimeout(() => poll(wind, subprocesses, name, p), 1000)
  }
}

function stopInstance(wind, name, subprocesses) {
  if (subprocesses[name]) {
    subprocesses[name].running = false
    sendStatus(wind, subprocesses, false, name)
    subprocesses[name].kill()
  }
}

function startInstance(wind, name, subprocesses, port) {
  try {
    let subpy = startCore(wind, process.platform, name, port)
    if (subpy !== null) {
      subprocesses[name] = subpy
      subprocesses[name].running = true
      sendStatus(wind, subprocesses, false, name)
      poll(wind, subprocesses, name, port)
      subpy.on('exit', () => {
        if (subprocesses[name]) {
          subprocesses[name].running = false
        }
        sendStatus(wind, subprocesses, false, name)
      })
      subpy.on('error', () => {
        if (subprocesses[name]) {
          subprocesses[name].running = false
        }
        sendStatus(wind, subprocesses, false, name)
      })
    }
  } catch (error) {
    console.error(`Error starting instance "${name}": ${error}`)
  }
}

function sendStatus(wind, subprocesses, connected = false, n) {
  let status = {}
  let platformParams = coreParams[process.platform]

  for (let name in platformParams) {
    if (subprocesses[name]) {
      if (name === n) {
        status[name] = connected
          ? 'running'
          : subprocesses[name].running
            ? 'starting'
            : 'stopped'
      } else {
        status[name] = subprocesses[name].running ? 'running' : 'stopped'
      }
    } else {
      status[name] = 'stopped'
    }
  }
  wind.webContents.send('fromMain', ['status', status])
}

function kills(subprocess) {
  if (subprocess !== null) {
    subprocess.kill('SIGINT')
  }
}

function closeAllSubs(wind, subpy, subprocesses) {
  if (subpy !== null) kills(subpy)
  if (Object.keys(subprocesses).length > 0) {
    Object.values(subprocesses).forEach((sub) => {
      kills(sub)
    })
  }
  console.log(5)
  wind.webContents.send('fromMain', 'shutdown')
}

module.exports = {
  poll,
  stopInstance,
  startInstance,
  sendStatus,
  kills,
  closeAllSubs
}
