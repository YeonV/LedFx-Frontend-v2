import { useState } from 'react'
import { MenuItem, ListItemIcon, Badge } from '@mui/material'
import Tour from './Tour'
import { InfoRounded } from '@mui/icons-material'
import useStore from '../../store/useStore'

const steps = [
  {
    selector: '.step-scenes-one',
    content: (
      <div>
        <h2>Scenes Overview</h2>
        Scenes let you save the complete state of LedFx including all active effects, their
        settings, and device configurations.
        <ul style={{ paddingLeft: '1rem' }}>
          <li>Click any scene card to instantly activate that configuration</li>
          <li>Scenes can include custom images, icons, tags, and even MIDI triggers</li>
          <li>Perfect for quickly switching between lighting moods and shows</li>
        </ul>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-scenes-two',
    content: (
      <div>
        <h2>Creating Scenes</h2>
        <ul style={{ paddingLeft: '1rem' }}>
          <li>First, configure your effects on the Devices page</li>
          <li>
            Then click the <strong>+</strong> button in the action bar
          </li>
          <li>Give your scene a name and optionally add an image</li>
          <li>The image picker supports user assets, cached images, and built-in graphics</li>
        </ul>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-scenes-three',
    content: (
      <div>
        <h2>Tag Filtering</h2>
        Tags help organize your scenes into categories.
        <ul style={{ paddingLeft: '1rem' }}>
          <li>Add tags when creating or editing scenes (comma-separated)</li>
          <li>Click tag chips to filter the scene grid</li>
          <li>Multiple tags can be active at once</li>
          <li>Great for organizing by mood, event, or room</li>
        </ul>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-scenes-four',
    content: (
      <div>
        <h2>Scene Widgets</h2>
        Quick access widgets show your most relevant scenes:
        <ul style={{ paddingLeft: '1rem' }}>
          <li>
            <strong>Recent Scenes:</strong> Your recently activated scenes
          </li>
          <li>
            <strong>Most Used:</strong> Your frequently used favorites
          </li>
          <li>
            <strong>Playlists:</strong> Automated scene rotation with customizable timing
          </li>
        </ul>
        <p style={{ marginTop: '0.5rem' }}>Enable/disable these widgets in Settings → Features</p>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-scenes-five',
    content: (
      <div>
        <h2>Scene Management</h2>
        <ul style={{ paddingLeft: '1rem' }}>
          <li>Click the menu (⋮) on any scene card to edit, delete or reorder</li>
          <li>
            <strong>Edit mode:</strong> Modify effect settings per virtual device
          </li>
          <li>
            <strong>Advanced:</strong> Add webhooks, MIDI activation, or custom payloads
          </li>
        </ul>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-scenes-six',
    content: (
      <div>
        <h2>Backend Playlists</h2>
        Create automated scene sequences that run on the server:
        <ul style={{ paddingLeft: '1rem' }}>
          <li>Add multiple scenes with custom durations</li>
          <li>Choose sequential or random playback</li>
          <li>Playlists continue running even if you close the browser</li>
          <li>Perfect for unattended displays or parties</li>
        </ul>
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  }
]

const TourScenes = ({ cally }: any) => {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const setTour = useStore((state) => state.setTour)
  const invisible = useStore((state) => state.tours.devices)

  return (
    <>
      <MenuItem
        onClick={(e) => {
          setIsTourOpen(true)
          cally(e)
          setTour('scenes')
        }}
      >
        <ListItemIcon>
          <Badge variant="dot" color="error" invisible={invisible}>
            <InfoRounded />
          </Badge>
        </ListItemIcon>
        Tour
      </MenuItem>
      <Tour
        steps={steps}
        accentColor="#800000"
        isOpen={isTourOpen}
        onRequestClose={() => setIsTourOpen(false)}
      />
    </>
  )
}

export default TourScenes
