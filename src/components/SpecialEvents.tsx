import xmas from '../assets/xmas.png'
import newyear from '../assets/fireworks.jpg'

const SpecialEvents = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const date = now.getDate()

  const events = [
    {
      name: 'Christmas',
      condition: year === 2024 && month === 11 && date >= 24,
      style: {
        backgroundImage: `url(${xmas})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom'
      }
    },
    {
      name: 'New Year',
      condition: year === 2025 && month === 0 && date === 1,
      style: {
        backgroundImage: `url(${newyear})`,
        backgroundSize: 'contain',
        backgroundPosition: 'bottom right'
      }
    }
  ]

  const activeEvent = events.find((e) => e.condition)

  if (!activeEvent) return null

  return (
    <div
      style={{
        margin: 'auto',
        backgroundRepeat: 'no-repeat',
        display: 'block',
        zIndex: -1,
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0.7,
        ...activeEvent.style
      }}
    />
  )
}

export default SpecialEvents
