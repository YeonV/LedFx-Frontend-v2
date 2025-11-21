import { useEffect, useMemo } from 'react'
import { useFireTvStore } from './useFireTvStore'
import useStore from '../../store/useStore'
import { FireTvButton, FireTvButtonConfig } from './FireTv.props'

type FireTvButtonsConfig = {
  menu?: boolean
  enabled?: boolean
} & Partial<Record<Exclude<FireTvButton, 'menu'>, string | FireTvButtonConfig>>

export const useFireTv = (config: FireTvButtonsConfig) => {
  const setButtons = useFireTvStore((state) => state.setButtons)
  const clearButtons = useFireTvStore((state) => state.clearButtons)
  const features = useStore((state) => state.features)

  const { enabled = true, ...buttonConfig } = config

  // Check if FireTV feature is enabled globally
  const isFireTvEnabled = features.firetv

  // Memoize the config to prevent infinite loops
  const configWithMenu = useMemo(() => {
    if (!enabled || !isFireTvEnabled) return {} // Disabled if either flag is false

    const normalized: Partial<Record<FireTvButton, FireTvButtonConfig | boolean | string>> = {
      menu: true,
      ...buttonConfig
    }

    // Normalize string values to FireTvButtonConfig objects
    Object.keys(normalized).forEach((key) => {
      const buttonKey = key as FireTvButton
      const value = normalized[buttonKey]

      if (typeof value === 'string') {
        normalized[buttonKey] = { label: value }
      }
    })

    return normalized as Partial<Record<FireTvButton, FireTvButtonConfig | boolean>>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(buttonConfig), enabled, isFireTvEnabled])

  useEffect(() => {
    if (enabled && isFireTvEnabled) {
      setButtons(configWithMenu)
    } else {
      clearButtons()
    }

    return () => {
      clearButtons()
    }
  }, [configWithMenu, enabled, isFireTvEnabled, setButtons, clearButtons])
}
