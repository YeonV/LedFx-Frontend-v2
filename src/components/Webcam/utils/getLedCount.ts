export const getLedCount = async (wledIp: string) => {
  try {
    const response = await fetch(`http://${wledIp}/json/info`)
    const info = await response.json()
    return info.leds.count
  } catch (error) {
    console.error(error)
  }
}

// export default getLedCount
