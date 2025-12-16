import { MenuItem, ListItemIcon } from '@mui/material'

import TourDevice from '../../Tours/TourDevice'
import TourScenes from '../../Tours/TourScenes'
import TourSettings from '../../Tours/TourSettings'
import TourDevices from '../../Tours/TourDevices'
import TourIntegrations from '../../Tours/TourIntegrations'
import TourHome from '../../Tours/TourHome'
import { themes } from '../../../themes/AppThemes'
import OrderListDialog from '../../DnD/OrderListDialog'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'
import useStore from '../../../store/useStore'

export interface TopBarMenuProps {
  slug: string
  invisible: boolean
}

// Helper component for menu items
export const MenuLine = ({
  icon,
  text,
  onClick
}: {
  icon: React.ReactNode
  text: string
  onClick: () => void
}) => (
  <MenuItem onClick={onClick}>
    <ListItemIcon>{icon}</ListItemIcon>
    {text}
  </MenuItem>
)

// Theme helper functions
export const getThemeMode = (themeName: string) => (themeName.startsWith('Dark') ? 'dark' : 'light')

export const getThemeColor = (themeName: string, mode: string) => {
  return (
    ((mode === 'dark' ? themeName.split('Dark')[1] : themeName.split('Light')[1])?.toLowerCase() as
      | keyof typeof themes
      | undefined) || 'blue'
  )
}

export const toggleThemeMode = (currentTheme: string) => {
  const mode = getThemeMode(currentTheme)
  const color = getThemeColor(currentTheme, mode)
  return (mode === 'dark' ? 'Light' : 'Dark') + color.charAt(0).toUpperCase() + color.slice(1)
}

// Render context-aware tour component
export const renderTourForSlug = (slug: string, onClose: () => void) => {
  switch (slug) {
    case 'device':
      return <TourDevice cally={onClose} />
    case 'Scenes':
      return <TourScenes cally={onClose} />
    case 'Settings':
      return <TourSettings cally={onClose} />
    case 'Devices':
      return [
        <OrderListDialog key={'order'} mode="drawer" onOpen={onClose} />,
        <TourDevices key={'device-tour'} cally={onClose} />
      ]
    case 'Integrations':
      return <TourIntegrations cally={onClose} />
    default:
      return <TourHome variant="menuitem" cally={onClose} />
  }
}

export const renderContextMenuItems = (
  slug: string,
  onClose: () => void,
  storeValues?: {
    graphs: boolean
    graphsMulti: boolean
    showMatrix: boolean
    infoAlerts: { devices: boolean; scenes: boolean }
    showComplex: boolean
    showGaps: boolean
    features: {
      streamto: boolean
      transitions: boolean
      frequencies: boolean
      effectfilter: boolean
      sceneRecent: boolean
      sceneMostUsed: boolean
      scenePlaylist: boolean
      scenechips: boolean
      sceneexternal: boolean
      sceneScroll: boolean
    }
    showHex: boolean
    blenderAutomagic: boolean
  }
) => {
  // Get store methods (not values)
  const toggleGraphs = useStore.getState().toggleGraphs
  const toggleGraphsMulti = useStore.getState().toggleGraphsMulti
  const toggleShowMatrix = useStore.getState().toggleShowMatrix
  const setInfoAlerts = useStore.getState().setInfoAlerts
  const setShowComplex = useStore.getState().setShowComplex
  const setShowGaps = useStore.getState().setShowGaps
  const setFeatures = useStore.getState().setFeatures
  const setShowHex = useStore.getState().setShowHex
  const setBlenderAutomagic = useStore.getState().setBlenderAutomagic

  // Use passed values or fallback to store
  const graphs = storeValues?.graphs ?? useStore.getState().graphs
  const graphsMulti = storeValues?.graphsMulti ?? useStore.getState().graphsMulti
  const showMatrix = storeValues?.showMatrix ?? useStore.getState().showMatrix
  const infoAlerts = storeValues?.infoAlerts ?? useStore.getState().uiPersist.infoAlerts
  const showComplex = storeValues?.showComplex ?? useStore.getState().showComplex
  const showGaps = storeValues?.showGaps ?? useStore.getState().showGaps

  switch (slug) {
    case 'device':
      return [
        <MenuLine
          key="device-graph"
          icon={<BladeIcon name={graphs ? 'mdi:chart-line' : 'mdi:chart-line-variant'} />}
          text={`${graphs ? 'Hide' : 'Show'} Graph`}
          onClick={() => {
            toggleGraphs()
          }}
        />,
        <MenuLine
          key="device-copyto"
          icon={
            <BladeIcon
              name={
                storeValues?.features.streamto ? 'mdi:content-copy' : 'mdi:content-copy-outline'
              }
            />
          }
          text={`${storeValues?.features.streamto ? 'Hide' : 'Show'} Copy To`}
          onClick={() => {
            setFeatures('streamto', !storeValues?.features.streamto)
          }}
        />,
        <MenuLine
          key="device-transitions"
          icon={
            <BladeIcon
              name={storeValues?.features.transitions ? 'mdi:transition' : 'mdi:transition-masked'}
            />
          }
          text={`${storeValues?.features.transitions ? 'Hide' : 'Show'} Transitions`}
          onClick={() => {
            setFeatures('transitions', !storeValues?.features.transitions)
          }}
        />,
        <MenuLine
          key="device-frequencies"
          icon={
            <BladeIcon
              name={storeValues?.features.frequencies ? 'mdi:sine-wave' : 'mdi:waveform'}
            />
          }
          text={`${storeValues?.features.frequencies ? 'Hide' : 'Show'} Frequencies`}
          onClick={() => {
            setFeatures('frequencies', !storeValues?.features.frequencies)
          }}
        />,
        <MenuLine
          key="device-effectfilter"
          icon={
            <BladeIcon
              name={storeValues?.features.effectfilter ? 'mdi:filter' : 'mdi:filter-outline'}
            />
          }
          text={`${storeValues?.features.effectfilter ? 'Hide' : 'Show'} Effect Filter`}
          onClick={() => {
            setFeatures('effectfilter', !storeValues?.features.effectfilter)
          }}
        />,
        <MenuLine
          key="device-hex"
          icon={<BladeIcon name={storeValues?.showHex ? 'mdi:pound' : 'mdi:pound-box-outline'} />}
          text={`${storeValues?.showHex ? 'Hide' : 'Show'} Hex-Input in GradientPicker`}
          onClick={() => {
            setShowHex(!storeValues?.showHex)
          }}
        />,
        <MenuLine
          key="device-automagic"
          icon={
            <BladeIcon
              name={storeValues?.blenderAutomagic ? 'mdi:auto-fix' : 'mdi:auto-fix-outline'}
            />
          }
          text={`${storeValues?.blenderAutomagic ? 'Disable' : 'Enable'} Blender Automagic`}
          onClick={() => {
            setBlenderAutomagic(!storeValues?.blenderAutomagic)
          }}
        />
      ]
    case 'Scenes':
      return [
        <MenuLine
          key="scenes-infobox"
          icon={
            <BladeIcon
              name={storeValues?.infoAlerts.scenes ? 'mdi:information' : 'mdi:information-outline'}
            />
          }
          text={`${storeValues?.infoAlerts.scenes ? 'Hide' : 'Show'} Infobox`}
          onClick={() => {
            setInfoAlerts('scenes', !storeValues?.infoAlerts.scenes)
          }}
        />,
        <MenuLine
          key="scenes-recent"
          icon={
            <BladeIcon
              name={storeValues?.features.sceneRecent ? 'mdi:clock-check' : 'mdi:clock-outline'}
            />
          }
          text={`${storeValues?.features.sceneRecent ? 'Hide' : 'Show'} Recent Scenes`}
          onClick={() => {
            setFeatures('sceneRecent', !storeValues?.features.sceneRecent)
          }}
        />,
        <MenuLine
          key="scenes-mostused"
          icon={
            <BladeIcon
              name={storeValues?.features.sceneMostUsed ? 'mdi:star' : 'mdi:star-outline'}
            />
          }
          text={`${storeValues?.features.sceneMostUsed ? 'Hide' : 'Show'} Most Played Scenes`}
          onClick={() => {
            setFeatures('sceneMostUsed', !storeValues?.features.sceneMostUsed)
          }}
        />,
        <MenuLine
          key="scenes-playlist"
          icon={
            <BladeIcon
              name={
                storeValues?.features.scenePlaylist ? 'mdi:playlist-check' : 'mdi:playlist-plus'
              }
            />
          }
          text={`${storeValues?.features.scenePlaylist ? 'Hide' : 'Show'} Scenes Playlist`}
          onClick={() => {
            setFeatures('scenePlaylist', !storeValues?.features.scenePlaylist)
          }}
        />,
        <MenuLine
          key="scenes-chips"
          icon={
            <BladeIcon
              name={storeValues?.features.scenechips ? 'mdi:tag-multiple' : 'mdi:tag-outline'}
            />
          }
          text={`${storeValues?.features.scenechips ? 'Hide' : 'Show'} SceneChips (Filter Tags)`}
          onClick={() => {
            setFeatures('scenechips', !storeValues?.features.scenechips)
          }}
        />,
        <MenuLine
          key="scenes-external"
          icon={
            <BladeIcon
              name={
                storeValues?.features.sceneexternal ? 'mdi:link-variant' : 'mdi:link-variant-off'
              }
            />
          }
          text={`${storeValues?.features.sceneexternal ? 'Hide' : 'Show'} External call`}
          onClick={() => {
            setFeatures('sceneexternal', !storeValues?.features.sceneexternal)
          }}
        />,
        <MenuLine
          key="scenes-scroll"
          icon={
            <BladeIcon
              name={
                storeValues?.features.sceneScroll
                  ? 'mdi:arrow-split-vertical'
                  : 'mdi:arrow-collapse-vertical'
              }
            />
          }
          text={`${storeValues?.features.sceneScroll ? 'Hide' : 'Show'} Separate scrollbar`}
          onClick={() => {
            setFeatures('sceneScroll', !storeValues?.features.sceneScroll)
          }}
        />
      ]
    case 'Settings':
      return [
        <MenuLine
          key="settings-1"
          icon={<BladeIcon name="mdi:backup-restore" />}
          text="Export Config"
          onClick={() => {
            /* your logic */ onClose()
          }}
        />,
        <MenuLine
          key="settings-2"
          icon={<BladeIcon name="mdi:import" />}
          text="Import Config"
          onClick={() => {
            /* your logic */ onClose()
          }}
        />
      ]
    case 'Devices':
      return [
        <MenuLine
          key="devices-infobox"
          icon={
            <BladeIcon name={infoAlerts.devices ? 'mdi:information' : 'mdi:information-outline'} />
          }
          text={`${infoAlerts.devices ? 'Hide' : 'Show'} Infobox`}
          onClick={() => {
            setInfoAlerts('devices', !infoAlerts.devices)
          }}
        />,
        <MenuLine
          key="devices-graph"
          icon={<BladeIcon name={graphs ? 'mdi:chart-line' : 'mdi:chart-line-variant'} />}
          text={`${graphs ? 'Disable' : 'Enable'} Graphs`}
          onClick={() => {
            toggleGraphs()
          }}
        />,
        <MenuLine
          key="devices-graphs-multi"
          icon={<BladeIcon name={graphsMulti ? 'mdi:chart-multiple' : 'mdi:chart-box-outline'} />}
          text={`${graphsMulti ? 'Hide' : 'Show'} Graphs`}
          onClick={() => {
            if (graphs) {
              toggleGraphsMulti()
            }
          }}
        />,
        <MenuLine
          key="devices-matrix"
          icon={<BladeIcon name={showMatrix ? 'mdi:grid' : 'mdi:grid-off'} />}
          text={`${showMatrix ? 'Hide' : 'Show'} Matrix`}
          onClick={() => {
            if (graphs) {
              toggleShowMatrix()
            }
          }}
        />,
        <MenuLine
          key="devices-complex"
          icon={<BladeIcon name={showComplex ? 'mdi:eye' : 'mdi:eye-off'} />}
          text={`${showComplex ? 'Hide' : 'Show'} complex devices`}
          onClick={() => {
            setShowComplex(!showComplex)
          }}
        />,
        <MenuLine
          key="devices-gaps"
          icon={<BladeIcon name={showGaps ? 'mdi:view-compact' : 'mdi:view-comfy'} />}
          text={`${showGaps ? 'Hide' : 'Show'} gaps`}
          onClick={() => {
            setShowGaps(!showGaps)
          }}
        />
      ]
    case 'Integrations':
      return [
        <MenuLine
          key="integrations-1"
          icon={<BladeIcon name="mdi:link" />}
          text="Connect Service"
          onClick={() => {
            /* your logic */ onClose()
          }}
        />,
        <MenuLine
          key="integrations-2"
          icon={<BladeIcon name="mdi:cog" />}
          text="Configure"
          onClick={() => {
            /* your logic */ onClose()
          }}
        />
      ]
    default:
      return null
  }
}
