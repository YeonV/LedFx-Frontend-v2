import { Box, Collapse, IconButton, Slider, Stack, Tooltip, Typography } from '@mui/material'
import GlobalColorWidgetFloating from './GlobalColorWidgetFloating'
import { ArrowDropDown, Close, InfoOutline } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import { styled } from '@mui/material/styles'
import useStore from '../../../../../store/useStore'
import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/shallow'
import { Ledfx } from '../../../../../api/ledfx'
import BladeFrame from '../../../../SchemaForm/components/BladeFrame'
import Toggle from '../../../../SchemaForm/components/Toggle'

const Root = styled('div')({
  width: 300,
  background: '#1c1c1e',
  boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
  borderRadius: 8,
  overflow: 'hidden',
  userSelect: 'none'
})

const GlobalColorWidget = ({
  close,
  variant = 'default',
  name = 'Omni FX',
  isCollapsed,
  onToggleCollapse,
  targetIds,
}: {
  close?: () => void
  variant?: 'default' | 'floating'
  name?: string
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  targetIds?: string[]
}) => {
  const {
    colors,
    getColors,
    addColor,
    showHex,
    getVirtuals,
    getSystemConfig,
    setSystemConfig,
    globalBrightness
  } = useStore(
    useShallow((state) => ({
      colors: state.colors,
      getColors: state.getColors,
      addColor: state.addColor,
      getVirtuals: state.getVirtuals,
      showHex: state.uiPersist.showHex,
      getSystemConfig: state.getSystemConfig,
      setSystemConfig: state.setSystemConfig,
      globalBrightness: state.config.global_brightness
    }))
  )

  const [brightness, setBrightness] = useState((globalBrightness || 1) * 100)

  const setSystemSetting = (setting: string, value: any) => {
    setSystemConfig({ [setting]: value }).then(() => getSystemConfig())
  }

  useEffect(() => {
    setBrightness((globalBrightness || 0) * 100)
  }, [globalBrightness])

  const sendPartial = async (key: string, value: any) => {
    const payload: any = {
      action: 'apply_global',
      [key]: value
    };
    if (targetIds && targetIds.length > 0) {
      payload.virtuals = targetIds;
    }
    await Ledfx('/api/effects', 'PUT', payload);
    getVirtuals();
  }

  const handleAddGradient = (name: string, color: string) => {
    addColor({ [name]: color }).then(() => {
      getColors()
    })
  }

  useEffect(() => {
    getColors()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box component={variant === 'floating' ? GlobalColorWidgetFloating : Box}>
      <Root>
        <Stack
          direction={'row'}
          p={2}
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent={'space-between'}
          display="flex"
          className="drag-handle"
          sx={{ cursor: 'move' }}
        >
          {close && <span />}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              onClick={onToggleCollapse}
              sx={{ transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 0.2s' }}
            >
              <ArrowDropDown />
            </IconButton>
            <Typography>{name}</Typography>
            {variant === 'floating' && (
              <Tooltip title="Apply partial effect settings to all active effects.">
                <InfoOutline fontSize="small" sx={{ cursor: 'help' }} />
              </Tooltip>
            )}
          </Stack>
          {close && (
            <IconButton onClick={() => close && close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <Box p={2}>
          <Stack spacing={2}>
            <GradientPicker
              pickerBgColor={'linear-gradient(90deg, rgb(0, 255, 255) 0%, rgb(0, 0, 255) 100%)'}
              title={!isCollapsed ? 'color' : ''}
              isGradient={true}
              colors={colors}
              showHex={showHex}
              sendColorToVirtuals={(e: any) => sendPartial('gradient', e)}
              handleAddGradient={(name: string) => handleAddGradient(name, '#ff0000')}
            />
            <Collapse in={!isCollapsed} timeout="auto" unmountOnExit>
              <GradientPicker
                pickerBgColor={'#000000'}
                title={'background_color'}
                isGradient={false}
                colors={colors}
                showHex={showHex}
                sendColorToVirtuals={(e: any) => sendPartial('background_color', e)}
                handleAddGradient={(name: string) => handleAddGradient(name, '#000000')}
              />
              <BladeFrame title="Global Brightness" style={{ padding: '6px 12px' }}>
                <Slider
                  size="small"
                  value={brightness}
                  onChange={(_e, val) => typeof val === 'number' && setBrightness(val)}
                  step={1}
                  min={0}
                  max={100}
                  onChangeCommitted={(_e, val) =>
                    setSystemSetting('global_brightness', typeof val === 'number' ? val / 100 : 0)
                  }
                />
              </BladeFrame>
              <BladeFrame title="Brightness" style={{ padding: '6px 12px' }}>
                <Slider
                  size="small"
                  defaultValue={100}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => sendPartial('brightness', value)}
                  step={0.01}
                  min={0}
                  max={1}
                />
              </BladeFrame>
              <BladeFrame title="BG Brightness" style={{ padding: '6px 12px' }}>
                <Slider
                  size="small"
                  defaultValue={100}
                  valueLabelDisplay="auto"
                  onChange={(_, value) => sendPartial('background_brightness', value)}
                  step={0.01}
                  min={0}
                  max={1}
                />
              </BladeFrame>
              <BladeFrame title="Flip" style={{ padding: '6px 12px' }}>
                <Toggle title="Flip" onChange={(value) => sendPartial('flip', value)} />
              </BladeFrame>
              <BladeFrame title="Mirror" style={{ padding: '6px 12px' }}>
                <Toggle title="Mirror" onChange={(value) => sendPartial('mirror', value)} />
              </BladeFrame>
              <BladeFrame title="Blur" style={{ padding: '6px 12px' }}>
                <Toggle title="Blur" onChange={(value) => sendPartial('blur', value)} />
              </BladeFrame>
            </Collapse>
          </Stack>
        </Box>
      </Root>
    </Box>
  )
}

export default GlobalColorWidget
