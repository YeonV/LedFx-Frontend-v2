import { useEffect } from 'react'
import useStore from '../../../../store/useStore'
import GradientPicker from './GradientPicker'

const GradientPickerWrapper = ({
  pickerBgColor,
  title,
  index,
  virtId,
  isGradient = false,
  wrapperStyle
}: any) => {
  const updateEffect = useStore((state) => state.updateEffect)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const virtuals = useStore((state) => state.virtuals)
  const colors = useStore((state) => state.colors)
  const getColors = useStore((state) => state.getColors)
  const addColor = useStore((state) => state.addColor)
  const showHex = useStore((state) => state.uiPersist.showHex)

  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop]
      }
    }
  }

  const virtual = getV()

  const sendColorToVirtuals = (e: any) => {
    if (virtual && virtual.effect && virtual.effect.type) {
      // No need to refetch - WebSocket event will update state
      updateEffect(virtual.id, virtual.effect.type, { [title]: e }, false)
    }
  }

  const handleAddGradient = (name: string, color: string) => {
    addColor({ [name]: color }).then(() => {
      getColors()
    })
  }

  useEffect(() => {
    // Only fetch colors if not already loaded
    if (!colors || Object.keys(colors).length === 0) {
      getColors()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <GradientPicker
      pickerBgColor={pickerBgColor}
      title={title}
      index={index}
      isGradient={isGradient}
      wrapperStyle={wrapperStyle}
      colors={colors}
      handleAddGradient={handleAddGradient}
      sendColorToVirtuals={sendColorToVirtuals}
      showHex={showHex}
    />
  )
}
export default GradientPickerWrapper
