import useStore from '../../../store/useStore'

const wledGet = async (path = 'state') => {
  const wledIp = useStore.getState().videoMapper.wledIp
  if (!wledIp || wledIp === '') {
    return
  }
  try {
    const response = await fetch(`http://${wledIp}/json/${path}`)
    const json = await response.json()
    return json || response
  } catch (error) {
    console.error(error)
  }
}

export default wledGet
