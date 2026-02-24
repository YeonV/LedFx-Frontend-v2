import { useEffect } from 'react'
import isElectron from 'is-electron'
import useStore from '../store/useStore'
import { deleteFrontendConfig } from '../utils/helpers'

const useIpcHandlers = () => {
  const shutdown = useStore((state) => state.shutdown)
  const setPlatform = useStore((state) => state.setPlatform)
  const setProtoCall = useStore((state) => state.setProtoCall)
  const showSnackbar = useStore((state) => state.ui.showSnackbar)
  const setCoreParams = useStore((state) => state.setCoreParams)
  const setCoreStatus = useStore((state) => state.setCoreStatus)

  useEffect(() => {
    // Register IPC listener
    const removeListener = window.api?.receive('fromMain', (parameters: any) => {
      if (parameters === 'shutdown') {
        shutdown()
      }
      if (parameters[0] === 'platform') {
        setPlatform(parameters[1])
      }
      if (parameters[0] === 'currentdir') {
        console.log(parameters[1])
      }
      if (parameters[0] === 'protocol') {
        const protocolData = JSON.parse(parameters[1])
        const protocolUrl = protocolData.url || protocolData.commandLine?.pop()
        if (protocolUrl) {
          setProtoCall(protocolUrl)
        }
      }
      if (parameters[0] === 'snackbar') {
        showSnackbar('info', parameters[1])
      }
      if (parameters[0] === 'coreParams') {
        setCoreParams(parameters[1])
      }
      if (parameters[0] === 'status') {
        setCoreStatus(parameters[1])
      }
      if (parameters === 'clear-frontend') {
        deleteFrontendConfig()
      }
    })

    // Bootstrap IPC calls
    if (isElectron()) {
      window.api?.send('toMain', { command: 'get-platform' })
      window.api?.send('toMain', { command: 'get-core-params' })
      window.api?.send('toMain', { command: 'close-others' })
    }

    return () => {
      if (typeof removeListener === 'function') {
        ;(removeListener as any)()
      }
    }
  }, [shutdown, setPlatform, setProtoCall, showSnackbar, setCoreParams, setCoreStatus])
}

export default useIpcHandlers
