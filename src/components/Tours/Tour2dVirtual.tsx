import { useState } from 'react'
import {
  IconButton,
  Tooltip,
  useTheme,
  Typography,
  Box,
  List,
  ListItem,
  Divider
} from '@mui/material'
import Tour from './Tour'
import {
  Help,
  AspectRatio,
  OpenWith,
  Tune,
  Settings,
  CameraAlt,
  Edit,
  Timeline,
  Transform,
  ViewModule
} from '@mui/icons-material'
import useStore from '../../store/useStore'

// Helper component for consistent styling of tour steps
const TourStep = ({
  title,
  children,
  icon: Icon
}: {
  title: string
  children: React.ReactNode
  icon?: React.ElementType
}) => (
  <Box sx={{ maxWidth: 350, color: 'white' }}>
    <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
      {Icon && <Icon sx={{ mr: 1, color: 'primary.main' }} />}
      {title}
    </Typography>
    <Divider sx={{ mb: 1.5 }} />
    <Typography variant="body2" component="div">
      {children}
    </Typography>
  </Box>
)

const baseStyle = {
  backgroundColor: '#303030',
  padding: '16px',
  borderRadius: '8px'
}

// NOTE: Selectors rely on corresponding 'step-2d-virtual-*' classes being present in MControls.tsx and EditMatrix.tsx

const steps = [
  // ---------------------------
  // Phase 1: Introduction & Setup
  // ---------------------------
  {
    // We use .react-transform-wrapper to point to the main grid area
    selector: '.yz',
    content: (
      <TourStep title="Welcome to 2D Mapping" icon={ViewModule}>
        This is the 2D Virtual Mapper. Here, you define the physical layout of your LEDs on a 2D
        grid.
        <br />
        <br />
        LedFx uses this grid to render 2D effects accurately onto your unique setup.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    selector: '.step-2d-virtual-three',
    content: (
      <TourStep title="Define Grid Size" icon={AspectRatio}>
        Start by setting the total Rows and Columns for your 2D layout.
        <br />
        <br />
        This defines the canvas size you will map your pixels onto. Adjust these sliders to match
        your desired resolution.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // Pointing again to the canvas area to explain navigation
    selector: '.react-transform-wrapper',
    content: (
      <TourStep title="Navigating the Canvas" icon={OpenWith}>
        Interact with the grid:
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>Zoom:</strong> Use your mouse wheel.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>Pan:</strong> Left-click and drag.
          </ListItem>
        </List>
        This navigation is active when the "DND-Canvas" mode is selected.
      </TourStep>
    ),
    style: baseStyle,
    // Ensure we are in Canvas mode for this step
    action: () => {
      const canvasTab = document.querySelector('.MuiTab-root[value="1"]') as HTMLElement
      if (canvasTab) canvasTab.click()
    }
  },

  // ---------------------------
  // Phase 2: Mapping Pixels
  // ---------------------------
  {
    // Pointing to the canvas where the action occurs
    selector: '.react-transform-component',
    content: (
      <TourStep title="Mapping Pixels" icon={Edit}>
        Time to map your physical LEDs onto this grid!
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>Right-click</strong> an empty cell on the grid.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            In the dialog, select a Device and assign the corresponding Pixel Index.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            Use "Group Mapping" to assign a range of pixels quickly.
          </ListItem>
        </List>
      </TourStep>
    ),
    style: baseStyle
  },
  {
    selector: '.react-transform-component',
    content: (
      <TourStep title="Editing & Moving Groups">
        Once pixels are mapped, you can adjust them.
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>Right-click</strong> a mapped pixel to Edit, Clear, or Move its Group.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            If you select "Move Group", the directional controls (arrows) will appear in the
            sidebar.
          </ListItem>
        </List>
      </TourStep>
    ),
    style: baseStyle
  },

  // ---------------------------
  // Phase 3: Tools and Refinement
  // ---------------------------
  {
    selector: '.step-2d-virtual-four',
    content: (
      <TourStep title="Layout Tools" icon={Transform}>
        Use these tools to manipulate the entire grid:
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            Rotate 90°, Flip Horizontally/Vertically.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            Use <strong>Reset</strong> to reload the saved configuration.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            Don't forget to <strong>Save</strong> your mapping!
          </ListItem>
        </List>
      </TourStep>
    ),
    style: baseStyle
  },
  {
    selector: '.step-2d-virtual-two',
    content: (
      <TourStep title="Live Pixel Graph" icon={Timeline}>
        Click the Play button to overlay the live visualization onto your 2D grid.
        <br />
        <br />
        This helps you verify that your mapping correctly aligns with the effects being generated by
        LedFx in real-time.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    selector: '.step-2d-virtual-six',
    content: (
      <TourStep title="Interaction Modes" icon={Settings}>
        Switch how you interact with the mapper:
        <List dense sx={{ listStyleType: 'disc', pl: 4 }}>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>DND-Canvas:</strong> For zooming/panning the whole grid and right-click mapping.
          </ListItem>
          <ListItem sx={{ display: 'list-item' }}>
            <strong>DND-Pixels:</strong> Drag and drop individual mapped pixels to reposition them
            (disables zoom/pan).
          </ListItem>
        </List>
      </TourStep>
    ),
    style: baseStyle
  },

  // -----------------------------------
  // Phase 4: Camera Mapper (Conditional)
  // -----------------------------------
  // Note: These steps are conditionally added based on `features.matrix_cam` in the Tour2dVirtual component.

  // Assuming a selector exists on the "Map Pixels via Camera" button
  {
    selector: '.step-2d-virtual-cam-toggle', // Needs corresponding class in MControls.tsx
    content: (
      <TourStep title="Camera Mapper [Beta]" icon={CameraAlt}>
        Automate the mapping process! Use your webcam to detect the physical location of your LEDs
        and map them automatically to the grid.
        <br />
        <br />
        Click here to start the Camera Mapper tool.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // This selector should be on the Initialize button within the Webcam component
    selector: '.step-2d-virtual-cam-initialize',
    content: (
      <TourStep title="Initialize Camera">
        First, initialize the camera. Ensure your LED setup is clearly visible in the camera feed.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // Selector for adjustment controls within the Webcam component
    selector: '.step-2d-virtual-cam-adjust',
    content: (
      <TourStep title="Adjust Camera Settings" icon={Tune}>
        Adjust brightness, contrast, and gamma to optimize the camera's view of your LEDs. The goal
        is clear visibility of the lights against the background.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // Selector for the Calibrate button
    selector: '.step-2d-virtual-cam-calibrate',
    content: (
      <TourStep title="Calibrate">
        Calibration helps LedFx understand the perspective and dimensions of your setup. Follow the
        on-screen prompts during calibration.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // Selector for Cropping tools
    selector: '.step-2d-virtual-cam-crop',
    content: (
      <TourStep title="Crop & Mask">
        Use the cropping tools to focus the detection area precisely on your LEDs, excluding
        background noise or other light sources.
      </TourStep>
    ),
    style: baseStyle
  },
  {
    // Selector for LED detection settings (brightness, threshold)
    selector: '.step-2d-virtual-cam-settings',
    content: (
      <TourStep title="Detection Thresholds" icon={Settings}>
        Fine-tune these settings to ensure accurate LED detection.
        <br />
        <br />
        Adjust the <strong>LED brightness</strong> and <strong>detection threshold</strong> so LedFx
        reliably identifies each pixel during the mapping process.
      </TourStep>
    ),
    style: baseStyle
  }
]

const Tour2dVirtual = () => {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const setTour = useStore((state) => state.setTour)
  const features = useStore((state) => state.features)
  const theme = useTheme()

  // Define the steps for the standard manual mapper
  const manualMapperSteps = steps.slice(0, 8)

  // Define the steps for the camera mapper
  const cameraMapperSteps = steps.slice(8)

  // Combine steps based on feature availability
  const activeSteps = features.matrix_cam
    ? [...manualMapperSteps, ...cameraMapperSteps]
    : manualMapperSteps

  return (
    <>
      <Tooltip title="How to use 2D Virtuals">
        <IconButton
          onClick={() => {
            setIsTourOpen(true)
            setTour('2d-virtual')
          }}
        >
          <Help />
        </IconButton>
      </Tooltip>
      <Tour
        steps={activeSteps}
        accentColor={theme.palette.primary.main}
        isOpen={isTourOpen}
        showNavigation={true} // Allow users to navigate back and forth
        onRequestClose={() => setIsTourOpen(false)}
        showNumber={true} // Show step numbers
        // Optionally close the camera mapper if the tour is closed during the camera steps
        lastStepNextButton={
          <Box
            onClick={() => {
              const exitCamMapperButton = document.querySelector(
                '.step-2d-virtual-cam-toggle button'
              ) as HTMLElement
              if (exitCamMapperButton && exitCamMapperButton.innerText.includes('Exit')) {
                exitCamMapperButton.click()
              }
            }}
          >
            Done
          </Box>
        }
      />
    </>
  )
}

export default Tour2dVirtual
