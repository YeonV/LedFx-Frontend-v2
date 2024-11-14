import { Button, useMediaQuery } from '@mui/material'
import useStore from '../../store/useStore'

const BladeScene = ({ onClick }: { onClick: () => void }) => {
  const vs = useStore((state) => state.virtuals)
  const autogenerating = Object.keys(vs)
    .filter((v: any) => vs[v].auto_generated)
    .map((vi: any) => vs[vi].segments[0][0])
    .filter((value, index, array) => array.indexOf(value) === index)
  const virtuals: any = Object.keys(vs)
    .filter((v: any) => autogenerating.indexOf(v) === -1)
    .reduce((obj, key) => {
      return {
        ...obj,
        [key]: vs[key]
      }
    }, {})

  const setEffect = useStore((state) => state.setEffect)
  // const updateEffect = useStore((state) => state.updateEffect)
  const activatePreset = useStore((state) => state.activatePreset)
  const addScene = useStore((state) => state.addScene)
  const small = useMediaQuery('(max-width: 720px)')

  const matrix = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].config.rows > 1
  )
  const smalls = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count < 9
  )
  const medium = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count >= 9 && virtuals[v].pixel_count < 100
  )
  const large = Object.keys(virtuals).filter(
    (v: string) => virtuals[v].pixel_count >= 100
  )
   
  const addBladeScene = () => {
    // if (noAuto) {
    large.map((v) => {
      setEffect(v, 'melt', {}, true)
      return activatePreset(v, 'ledfx_presets', 'melt', 'purple-red')
    })
    medium.map((v, _i) => {
      setEffect(v, 'blade_power_plus', {}, true)
      // if (_i % 2 === 0)
      //   updateEffect(v, 'blade_power_plus', { flip: true }, false)
      return activatePreset(
        v,
        'ledfx_presets',
        'blade_power_plus',
        'purplered-bass'
      )
    })

    smalls.map((v) => {
      setEffect(v, 'blade_power_plus', {}, true)
      return activatePreset(
        v,
        'ledfx_presets',
        'blade_power_plus',
        'orange-hi-hat'
      )
    })
    // Use medium as smalls
    if (Object.keys(smalls).length === 0 && Object.keys(medium).length > 1) {
      const v = medium.sort(
        (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
      )[0]
      setEffect(v, 'blade_power_plus', {}, true)
      activatePreset(v, 'ledfx_presets', 'blade_power_plus', 'orange-hi-hat')
    }
    // Use medium as large
    if (Object.keys(large).length === 0 && Object.keys(medium).length > 2) {
      const v = medium.sort(
        (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
      )[Object.keys(medium).length - 1]
      setEffect(v, 'melt', {}, true)
      activatePreset(v, 'ledfx_presets', 'melt', 'purple-red')
    }

    // Use large as smalls
    if (Object.keys(smalls).length === 0 && Object.keys(large).length > 1) {
      const v = large.sort(
        (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
      )[0]
      setEffect(v, 'blade_power_plus', {}, true)
      activatePreset(v, 'ledfx_presets', 'blade_power_plus', 'orange-hi-hat')
    }
    // Use large as medium
    if (Object.keys(medium).length === 0 && Object.keys(large).length > 2) {
      const v = large.sort(
        (a, b) => virtuals[a].pixel_count - virtuals[b].pixel_count
      )[1]
      setEffect(v, 'blade_power_plus', {}, true)
      activatePreset(v, 'ledfx_presets', 'blade_power_plus', 'purplered-bass')
    }
    if (Object.keys(matrix).length > 0) {
      matrix.map((v) => {
        return setEffect(
          v,
          'equalizer',
          { gradient_repeat: virtuals[v].config.rows },
          true
        )
      })
    }
    // }
    addScene('Blade Scene', 'yz:logo2', '', '', '', '')
  }

  return (
    <Button
      onClick={() => {
        // await addOffScene()
        addBladeScene()
        onClick()
      }}
      sx={{
        borderRadius: '3rem',
        textTransform: 'none',
        marginRight: small ? 0 : '1rem',
        width: small ? '80vw' : 'min(40vw, 550px)',
        fontSize: '2rem'
      }}
    >
      Add Blade Scene
    </Button>
  )
}

export const defaultEffects = {
  blenderMask: {
    type: 'blade_power_plus',
    config: {
      background_brightness: 1,
      background_color: "#000000",
      blur: 2,
      brightness: 1,
      decay: 0.7,
      fix_hues: true,
      flip: false,
      frequency_range: "Lows (beat+bass)",
      gradient: "#ffffff",
      gradient_roll: 0,
      mirror: false,
      multiplier: 0.5
      }
  },
  blenderForeground: {
    type: "blade_power_plus",
    config: {
      background_brightness: 0.63,
      background_color: "#000080",
      blur: 2,
      brightness: 1,
      decay: 0.7,
      fix_hues: true,
      flip: false,
      frequency_range: "Lows (beat+bass)",
      gradient: "linear-gradient(90deg, #00ffff 0.00%,#0000ff 100.00%)",
      gradient_roll: 0,
      mirror: false,
      multiplier: 0.5
      },
  },
  blenderBackground: {
    type: "blade_power_plus",
    config: {
      background_brightness: 0.09,
      background_color: "#000080",
      blur: 2,
      brightness: 1,
      decay: 0.7,
      fix_hues: false,
      flip: true,
      frequency_range: "High",
      gradient: "linear-gradient(90deg, rgb(255, 40, 0) 0%, rgb(255, 0, 0) 100%)",
      gradient_roll: 0,
      mirror: false,
      multiplier: 0.5
    }
  },
  blenderMask2d: {
    type: 'texter2d',
    config: {
      text: "LedFx",
      speed_option_1: 0.7,
      dump: false,
      background_color: "#000000",
      font: "Blade-5x8",
      flip: false,
      option_2: false,
      option_1: false,
      multiplier: 1,
      flip_vertical: false,
      use_gradient: false,
      brightness: 1,
      value_option_1: 0.5,
      text_color: "#ffffff",
      advanced: false,
      gradient_roll: 0,
      gradient: "linear-gradient(90deg, rgb(255, 0, 0) 0%, rgb(255, 120, 0) 14%, rgb(255, 200, 0) 28%, rgb(0, 255, 0) 42%, rgb(0, 199, 140) 56%, rgb(0, 0, 255) 70%, rgb(128, 0, 128) 84%, rgb(255, 0, 178) 98%)",
      background_brightness: 1,
      blur: 0,
      flip_horizontal: false,
      resize_method: "Fast",
      diag: false,
      height_percent: 100,
      text_effect: "Side Scroll",
      mirror: false,
      test: false,
      impulse_decay: 0.1,
      rotate: 0,
      deep_diag: false,
      alpha: false
    }
  },
  blenderForeground2d: {
    type: 'blade_power_plus',
    config: {
      blur: 2,
      background_color: "#000080",
      multiplier: 0.5,
      decay: 0.7,
      frequency_range: "Lows (beat+bass)",
      gradient: "linear-gradient(90deg, #00ffff 0.00%,#0000ff 100.00%)",
      mirror: false,
      flip: true,
      gradient_roll: 0,
      fix_hues: true,
      brightness: 1,
      background_brightness: 0.63
    }
  },
  blenderBackground2d: {
    type: 'plasma2d',
    config:{
      advanced: false,
      background_brightness: 1,
      background_color: "#000000",
      blur: 0,
      brightness: 0.15,
      density: 0.5,
      density_vertical: 0.1,
      diag: false,
      dump: false,
      flip: false,
      flip_horizontal: false,
      flip_vertical: false,
      frequency_range: "Lows (beat+bass)",
      gradient: "linear-gradient(90deg, #ff00b2 0.00%,#ff2800 50.00%,#ffc800 100.00%)",
      gradient_roll: 0,
      lower: 0.01,
      mirror: false,
      radius: 0.2,
      rotate: 0,
      test: false,
    }
  }
}

export default BladeScene
