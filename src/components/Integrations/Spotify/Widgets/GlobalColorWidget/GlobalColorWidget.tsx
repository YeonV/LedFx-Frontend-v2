import { Box, IconButton, Stack, Typography } from '@mui/material'
import GlobalColorWidgetFloating from './GlobalColorWidgetFloating'
import { Close } from '@mui/icons-material'
import GradientPicker from '../../../../SchemaForm/components/GradientPicker/GradientPicker'
import { styled } from '@mui/material/styles'
import useStore from '../../../../../store/useStore'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow'

const Root = styled('div')({
  width: 300,
  background: '#111'
})

const GlobalColorWidget = ({ close }: { close?: () => void }) => {
  const { virtuals, updateEffect, getVirtuals, colors, getColors, addColor, showHex } = useStore(
    useShallow((state) => ({
      virtuals: state.virtuals,
      updateEffect: state.updateEffect,
      getVirtuals: state.getVirtuals,
      colors: state.colors,
      getColors: state.getColors,
      addColor: state.addColor,
      showHex: state.uiPersist.showHex
    }))
  )

  const sendColorToVirtuals = (e: any, title: string) => {
    Object.values(virtuals).forEach((virtual) => {
      if (virtual && virtual.effect && virtual.effect.type && virtual.effect.config) {
        if (title === 'color') {
          if (virtual.effect.config.gradient !== undefined) {
            updateEffect(virtual.id, virtual.effect.type, { gradient: e }, false)
          } else if (virtual.effect.config.color !== undefined) {
            let color = e
            if (typeof e === 'string' && e.startsWith('linear-gradient')) {
              const match = e.match(/#([0-9a-f]{3,6})/i)
              if (match) {
                color = match[0]
              }
            }
            updateEffect(virtual.id, virtual.effect.type, { color }, false)
          }
        } else {
          updateEffect(virtual.id, virtual.effect.type, { [title]: e }, false)
        }
      }
    })
    getVirtuals()
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
    <Box component={GlobalColorWidgetFloating}>
      <Root>
        <Stack
          direction={'row'}
          p={2}
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent={close ? 'space-between' : 'center'}
          display="flex"
        >
          {close && <span />}
          <Typography>Global Color</Typography>
          {close && (
            <IconButton onClick={() => close && close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <Box p={2}>
          <Stack spacing={2}>
            <GradientPicker
              pickerBgColor={'#ff0000'}
              title={'color'}
              isGradient={true}
              colors={colors}
              showHex={showHex}
              sendColorToVirtuals={(e: any) => sendColorToVirtuals(e, 'color')}
              handleAddGradient={(name: string) => handleAddGradient(name, '#ff0000')}
            />
            <GradientPicker
              pickerBgColor={'#000000'}
              title={'background_color'}
              isGradient={true}
              colors={colors}
              showHex={showHex}
              sendColorToVirtuals={(e: any) => sendColorToVirtuals(e, 'background_color')}
              handleAddGradient={(name: string) => handleAddGradient(name, '#000000')}
            />
          </Stack>
        </Box>
      </Root>
    </Box>
  )
}

export default GlobalColorWidget
