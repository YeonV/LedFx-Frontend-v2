import useStore from '../../../store/useStore'

const wled = async (body: any) => {
  const wledIp = useStore.getState().videoMapper.wledIp
  try {
    const response = await fetch(`http://${wledIp}/json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
    const json = await response.json()
    return json
  } catch (error) {
    console.error(error)
  }
}

export default wled
