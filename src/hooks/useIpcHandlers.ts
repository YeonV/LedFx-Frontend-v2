import { useEffect } from 'react'
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
        // Handle both Windows (commandLine array) and macOS (url string) formats
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
      if (parameters[0] === 'all-windows') {
        // console.log('all-windows', parameters[1])
      }
    })

    return () => {
      if (typeof removeListener === 'function') {
        removeListener()
      }
    }
  }, [shutdown, setPlatform, setProtoCall, showSnackbar, setCoreParams, setCoreStatus])
}

export default useIpcHandlers
