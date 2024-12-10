import { useState } from 'react'
import { IconButton, Tooltip, useTheme } from '@mui/material'
import Tour from './Tour'
import { Help } from '@mui/icons-material'
import useStore from '../../store/useStore'

const steps = [
  {
    selector: '.step-2d-virtual-one',
    content: (
      <div>
        <h2>2D Virtuals</h2>
        Some Intro Text for 2D Virtuals
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-two',
    content: (
      <div>
        <h2>Explain</h2>
        import from segments and show pixel graph
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-three',
    content: (
      <div>
        <h2>Explain</h2>
        Rows & Cols
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-four',
    content: (
      <div>
        <h2>Dummy Headline</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-five',
    content: (
      <div>
        <h2>Dummy Headline</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-six',
    content: (
      <div>
        <h2>Dummy Headline</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-seven',
    content: (
      <div>
        <h2>Dummy Headline</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-eight',
    content: (
      <div>
        <h2>Dummy Headline</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-nine',
    content: (
      <div>
        <h2>Initialze</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-ten',
    content: (
      <div>
        <h2>Adjust</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-eleven',
    content: (
      <div>
        <h2>Calibrate</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-twelve',
    content: (
      <div>
        <h2>Crop</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  },
  {
    selector: '.step-2d-virtual-thirteen',
    content: (
      <div>
        <h2>Led, brightness, threshold</h2>
        Dummy Text
      </div>
    ),
    style: {
      backgroundColor: '#303030'
    }
  }
]

const Tour2dVirtual = () => {
  const [isTourOpen, setIsTourOpen] = useState(false)
  const setTour = useStore((state) => state.setTour)
  const features = useStore((state) => state.features)
  const theme = useTheme()
  return (
    <>
    <Tooltip title="How to use 2D Virtuals">
      <IconButton onClick={() => {
          setIsTourOpen(true)
          setTour('2d-virtual')
        }}
      >
        <Help />
      </IconButton>
      </Tooltip>
      <Tour
        steps={steps.slice(0, features['matrix_cam'] ? steps.length : 5)}
        accentColor={theme.palette.primary.main}
        isOpen={isTourOpen}
        showNavigation={false}
        // badgeContent={()=><Info size="small" />}
        onRequestClose={() => setIsTourOpen(false)}
        showNumber={false}
      />
    </>
  )
}

export default Tour2dVirtual
