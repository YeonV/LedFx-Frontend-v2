import { Button } from '@mui/material'
import useStore from '../../store/useStore'

const BladeScene = () => {
  const virtuals = useStore((state) => state.virtuals)
  const setVirtualEffect = useStore((state) => state.setVirtualEffect)
  const activatePreset = useStore((state) => state.activatePreset)
  const addScene = useStore((state) => state.addScene)

  const noAuto = !Object.keys(virtuals).some(
    (v: string) => virtuals[v].auto_generated
  )
  const small = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count < 6
  )
  const medium = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count >= 6 && virtuals[v].pixel_count < 100
  )
  const large = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count >= 100
  )

  // console.table({
  //   noAuto,
  //   small: Object.keys(small).length,
  //   medium: Object.keys(medium).length,
  //   large: Object.keys(large).length,
  // })

  const addBladeScene = () => {
    if (noAuto) {
      large.map((v) => {
        setVirtualEffect(v, 'melt', {}, true)
        return activatePreset(v, 'default_presets', 'melt', 'bladesmooth')
      })
      medium.map((v) => {
        setVirtualEffect(v, 'blade_power_plus', {}, true)
        return activatePreset(
          v,
          'default_presets',
          'blade_power_plus',
          'ocean-bass'
        )
      })

      small.map((v) => {
        setVirtualEffect(v, 'blade_power_plus', {}, true)
        return activatePreset(
          v,
          'default_presets',
          'blade_power_plus',
          'orange-hi-hat'
        )
      })
      // Use medium as small
      if (Object.keys(small).length === 0 && Object.keys(medium).length > 1) {
        const v = medium.sort(
          (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
        )[0]
        setVirtualEffect(v, 'blade_power_plus', {}, true)
        activatePreset(
          v,
          'default_presets',
          'blade_power_plus',
          'orange-hi-hat'
        )
      }
      // Use medium as large
      if (Object.keys(large).length === 0 && Object.keys(medium).length > 2) {
        const v = medium.sort(
          (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
        )[Object.keys(medium).length - 1]
        setVirtualEffect(v, 'melt', {}, true)
        activatePreset(v, 'default_presets', 'melt', 'bladesmooth')
      }

      // Use large as small
      if (Object.keys(small).length === 0 && Object.keys(large).length > 1) {
        const v = large.sort(
          (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
        )[0]
        setVirtualEffect(v, 'blade_power_plus', {}, true)
        activatePreset(
          v,
          'default_presets',
          'blade_power_plus',
          'orange-hi-hat'
        )
      }
      // Use large as medium
      if (Object.keys(medium).length === 0 && Object.keys(large).length > 2) {
        const v = large.sort(
          (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
        )[1]
        setVirtualEffect(v, 'blade_power_plus', {}, true)
        activatePreset(v, 'default_presets', 'blade_power_plus', 'ocean-bass')
      }
    }
    addScene('Blade Scene', '', '', '', '')
  }

  return (
    <Button
      onClick={addBladeScene}
      sx={{
        borderRadius: '3vh',
        textTransform: 'none',
        marginRight: small ? 0 : '1rem',
        width: small ? '80vw' : 'min(40vw, 550px)',
        minHeight: 'min(15vh, 120px)',
        fontSize: '2rem',
      }}
    >
      Add Blade Scene
    </Button>
  )
}

export default BladeScene
