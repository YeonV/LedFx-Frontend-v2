import React, { useState, useEffect, useRef } from 'react'
import { Box, Stack, styled, Portal } from '@mui/material'
import { useFireTvStore } from './useFireTvStore'
import useStore from '../../store/useStore'
import {
  BUTTON_ICONS,
  BUTTON_KEYCODES,
  BUTTON_LABELS,
  FireTvButton,
  FireTvButtonConfig
} from './FireTv.props'

const BUTTON_ORDER: FireTvButton[] = [
  'menu',
  'dpad',
  'dpadv',
  'dpadh',
  'play',
  'rewind',
  'forward',
  'enter',
  'up',
  'down',
  'left',
  'right',
  'back',
  'home'
]

const StyledButton = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'highlighted'
})<{ highlighted?: boolean }>(({ theme, highlighted }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '4px 12px',
  fontSize: '0.85rem',
  fontWeight: 400,
  color: highlighted ? theme.palette.primary.main : theme.palette.text.secondary,
  backgroundColor: highlighted ? 'rgba(33, 150, 243, 0.15)' : 'transparent',
  borderRadius: '4px',
  transition: 'all 0.1s ease',
  whiteSpace: 'nowrap',
  '& svg': {
    opacity: 0.8
  }
}))

const FireTvBar: React.FC = () => {
  const buttons = useFireTvStore((state) => state.buttons)
  const setBarHeight = useFireTvStore((state) => state.setBarHeight)
  const features = useStore((state) => state.features)
  const [highlighted, setHighlighted] = useState<number | null>(null)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!features.firetv) {
      setBarHeight(0)
    }
  }, [features.firetv, setBarHeight])

  // Don't render if FireTV feature is disabled

  useEffect(() => {
    const handlePress = (e: Event) => {
      const customEvent = e as CustomEvent<{ keyCode: number }>
      const { keyCode } = customEvent.detail
      setHighlighted(keyCode)
      setTimeout(() => setHighlighted(null), 200)
    }

    window.addEventListener('androidremote', handlePress as EventListener)
    return () => window.removeEventListener('androidremote', handlePress as EventListener)
  }, [])

  useEffect(() => {
    if (!features.firetv) {
      setBarHeight(0)
    } else {
      setBarHeight(42)
    }
  }, [features.firetv, setBarHeight])

  const hasAnyButtons = Object.keys(buttons).length > 0

  useEffect(() => {
    if (!hasAnyButtons) {
      setBarHeight(0)
    }
  }, [hasAnyButtons, setBarHeight])

  if (!features.firetv) {
    return null
  }

  if (!hasAnyButtons) return null

  return (
    <Portal>
      <Box
        ref={barRef}
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(10px)',
          zIndex: 99999,
          padding: '6px 16px'
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-around"
          flexWrap="wrap"
        >
          {BUTTON_ORDER.map((buttonKey) => {
            const value = buttons[buttonKey]
            if (!value) return null

            // Menu button special case
            if (buttonKey === 'menu' && value === true) {
              return (
                <StyledButton
                  key={buttonKey}
                  highlighted={highlighted === BUTTON_KEYCODES[buttonKey]}
                >
                  {BUTTON_ICONS[buttonKey]}
                  <span>{BUTTON_LABELS[buttonKey]}</span>
                </StyledButton>
              )
            }

            // Button with config object
            if (typeof value === 'object') {
              const config = value as FireTvButtonConfig
              const icon = config.icon || BUTTON_ICONS[buttonKey]
              const label = typeof config.label === 'function' ? config.label() : config.label

              return (
                <StyledButton
                  key={buttonKey}
                  highlighted={highlighted === BUTTON_KEYCODES[buttonKey]}
                >
                  {icon}
                  <span>{label}</span>
                </StyledButton>
              )
            }

            return null
          })}
        </Stack>
      </Box>
    </Portal>
  )
}

export default FireTvBar
