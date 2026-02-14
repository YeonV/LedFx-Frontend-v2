import { MenuLine } from './BarTop.utils'
import useStore from '../../../store/useStore'
import BladeIcon from '../../Icons/BladeIcon/BladeIcon'

interface ContextMenuItemsProps {
  slug: string
  onClose: () => void
}

export const ContextMenuItems = ({ slug, onClose }: ContextMenuItemsProps) => {
  const toggleGraphs = useStore((state) => state.toggleGraphs)
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)
  const setInfoAlerts = useStore((state) => state.setInfoAlerts)
  const setShowComplex = useStore((state) => state.setShowComplex)
  const setShowGaps = useStore((state) => state.setShowGaps)
  const setFeatures = useStore((state) => state.setFeatures)
  const setShowHex = useStore((state) => state.setShowHex)
  const setBlenderAutomagic = useStore((state) => state.setBlenderAutomagic)

  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const showMatrix = useStore((state) => state.showMatrix)
  const infoAlerts = useStore((state) => state.uiPersist.infoAlerts)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const features = useStore((state) => state.features)
  const showHex = useStore((state) => state.uiPersist.showHex)
  const blenderAutomagic = useStore((state) => state.uiPersist.blenderAutomagic)

  switch (slug) {
    case 'device':
      return (
        <>
          <MenuLine
            key="device-graph"
            icon={<BladeIcon name={graphs ? 'mdi:chart-line' : 'mdi:chart-line-variant'} />}
            text={`${graphs ? 'Hide' : 'Show'} Graph`}
            onClick={() => toggleGraphs()}
          />
          <MenuLine
            key="device-copyto"
            icon={
              <BladeIcon
                name={features.streamto ? 'mdi:content-copy' : 'mdi:content-copy-outline'}
              />
            }
            text={`${features.streamto ? 'Hide' : 'Show'} Copy To`}
            onClick={() => setFeatures('streamto', !features.streamto)}
          />
          <MenuLine
            key="device-transitions"
            icon={
              <BladeIcon name={features.transitions ? 'mdi:transition' : 'mdi:transition-masked'} />
            }
            text={`${features.transitions ? 'Hide' : 'Show'} Transitions`}
            onClick={() => setFeatures('transitions', !features.transitions)}
          />
          <MenuLine
            key="device-frequencies"
            icon={<BladeIcon name={features.frequencies ? 'mdi:sine-wave' : 'mdi:waveform'} />}
            text={`${features.frequencies ? 'Hide' : 'Show'} Frequencies`}
            onClick={() => setFeatures('frequencies', !features.frequencies)}
          />
          <MenuLine
            key="device-effectfilter"
            icon={<BladeIcon name={features.effectfilter ? 'mdi:filter' : 'mdi:filter-outline'} />}
            text={`${features.effectfilter ? 'Hide' : 'Show'} Effect Filter`}
            onClick={() => setFeatures('effectfilter', !features.effectfilter)}
          />
          <MenuLine
            key="device-hex"
            icon={<BladeIcon name={showHex ? 'mdi:pound' : 'mdi:pound-box-outline'} />}
            text={`${showHex ? 'Hide' : 'Show'} Hex-Input in GradientPicker`}
            onClick={() => setShowHex(!showHex)}
          />
          <MenuLine
            key="device-automagic"
            icon={<BladeIcon name={blenderAutomagic ? 'mdi:auto-fix' : 'mdi:auto-fix-outline'} />}
            text={`${blenderAutomagic ? 'Disable' : 'Enable'} Blender Automagic`}
            onClick={() => setBlenderAutomagic(!blenderAutomagic)}
          />
        </>
      )
    case 'Scenes':
      return (
        <>
          <MenuLine
            key="scenes-infobox"
            icon={
              <BladeIcon name={infoAlerts.scenes ? 'mdi:information' : 'mdi:information-outline'} />
            }
            text={`${infoAlerts.scenes ? 'Hide' : 'Show'} Infobox`}
            onClick={() => setInfoAlerts('scenes', !infoAlerts.scenes)}
          />
          <MenuLine
            key="scenes-recent"
            icon={
              <BladeIcon name={features.sceneRecent ? 'mdi:clock-check' : 'mdi:clock-outline'} />
            }
            text={`${features.sceneRecent ? 'Hide' : 'Show'} Recent Scenes`}
            onClick={() => setFeatures('sceneRecent', !features.sceneRecent)}
          />
          <MenuLine
            key="scenes-mostused"
            icon={<BladeIcon name={features.sceneMostUsed ? 'mdi:star' : 'mdi:star-outline'} />}
            text={`${features.sceneMostUsed ? 'Hide' : 'Show'} Most Played Scenes`}
            onClick={() => setFeatures('sceneMostUsed', !features.sceneMostUsed)}
          />
          <MenuLine
            key="scenes-playlist"
            icon={
              <BladeIcon
                name={features.scenePlaylist ? 'mdi:playlist-check' : 'mdi:playlist-plus'}
              />
            }
            text={`${features.scenePlaylist ? 'Hide' : 'Show'} Scenes Playlist`}
            onClick={() => setFeatures('scenePlaylist', !features.scenePlaylist)}
          />
          <MenuLine
            key="scenes-playlist-backend"
            icon={
              <BladeIcon
                name={
                  features.scenePlaylistBackend ? 'mdi:playlist-star' : 'mdi:playlist-music-outline'
                }
              />
            }
            text={`${features.scenePlaylistBackend ? 'Hide' : 'Show'} Scene Playlist (Backend)`}
            onClick={() => setFeatures('scenePlaylistBackend', !features.scenePlaylistBackend)}
          />
          <MenuLine
            key="scenes-chips"
            icon={<BladeIcon name={features.scenechips ? 'mdi:tag-multiple' : 'mdi:tag-outline'} />}
            text={`${features.scenechips ? 'Hide' : 'Show'} SceneChips (Filter Tags)`}
            onClick={() => setFeatures('scenechips', !features.scenechips)}
          />
          <MenuLine
            key="scenes-external"
            icon={
              <BladeIcon
                name={features.sceneexternal ? 'mdi:link-variant' : 'mdi:link-variant-off'}
              />
            }
            text={`${features.sceneexternal ? 'Hide' : 'Show'} External call`}
            onClick={() => setFeatures('sceneexternal', !features.sceneexternal)}
          />
          <MenuLine
            key="scenes-scroll"
            icon={
              <BladeIcon
                name={
                  features.sceneScroll ? 'mdi:arrow-split-vertical' : 'mdi:arrow-collapse-vertical'
                }
              />
            }
            text={`${features.sceneScroll ? 'Hide' : 'Show'} Separate scrollbar`}
            onClick={() => setFeatures('sceneScroll', !features.sceneScroll)}
          />
        </>
      )
    case 'Devices':
      return (
        <>
          <MenuLine
            key="devices-infobox"
            icon={
              <BladeIcon
                name={infoAlerts.devices ? 'mdi:information' : 'mdi:information-outline'}
              />
            }
            text={`${infoAlerts.devices ? 'Hide' : 'Show'} Infobox`}
            onClick={() => setInfoAlerts('devices', !infoAlerts.devices)}
          />
          <MenuLine
            key="devices-graph"
            icon={<BladeIcon name={graphs ? 'mdi:chart-line' : 'mdi:chart-line-variant'} />}
            text={`${graphs ? 'Disable' : 'Enable'} Graphs`}
            onClick={() => toggleGraphs()}
          />
          <MenuLine
            key="devices-graphs-multi"
            icon={<BladeIcon name={graphsMulti ? 'mdi:chart-multiple' : 'mdi:chart-box-outline'} />}
            text={`${graphsMulti ? 'Hide' : 'Show'} Graphs`}
            onClick={() => {
              if (graphs) toggleGraphsMulti()
            }}
          />
          <MenuLine
            key="devices-matrix"
            icon={<BladeIcon name={showMatrix ? 'mdi:grid' : 'mdi:grid-off'} />}
            text={`${showMatrix ? 'Hide' : 'Show'} Matrix`}
            onClick={() => {
              if (graphs) toggleShowMatrix()
            }}
          />
          <MenuLine
            key="devices-complex"
            icon={<BladeIcon name={showComplex ? 'mdi:eye' : 'mdi:eye-off'} />}
            text={`${showComplex ? 'Hide' : 'Show'} complex devices`}
            onClick={() => setShowComplex(!showComplex)}
          />
          <MenuLine
            key="devices-gaps"
            icon={<BladeIcon name={showGaps ? 'mdi:view-compact' : 'mdi:view-comfy'} />}
            text={`${showGaps ? 'Hide' : 'Show'} gaps`}
            onClick={() => setShowGaps(!showGaps)}
          />
          <MenuLine
            key="devices-visualisers"
            icon={<BladeIcon name={features.showVisualisersOnDevicesPage ? 'tv' : 'tvOff'} />}
            text={`${features.showVisualisersOnDevicesPage ? 'Hide' : 'Show'} Visualisers`}
            onClick={() =>
              setFeatures('showVisualisersOnDevicesPage', !features.showVisualisersOnDevicesPage)
            }
          />
        </>
      )
    case '':
      return (
        <>
          <MenuLine
            key="home-dashboard-detailed"
            icon={
              <BladeIcon
                name={features.dashboardDetailed ? 'mdi:details' : 'mdi:text-box-outline'}
              />
            }
            text={`${features.dashboardDetailed ? 'Simple' : 'Detailed'}  Dashboard`}
            onClick={() => setFeatures('dashboardDetailed', !features.dashboardDetailed)}
          />
          <MenuLine
            key="home-audio-graph"
            icon={<BladeIcon name={'mdi:waveform'} />}
            text={`${features.melbankGraph ? 'Hide' : 'Show'} Audio Graph`}
            onClick={() => {
              setFeatures('melbankGraph', !features.melbankGraph)
              onClose()
            }}
          />
        </>
      )
    default:
      return null
  }
}
