import {
  Settings,
  Loop,
  PlayArrow,
  Save,
  Stop,
  Delete,
  Cancel,
  EmergencyRecording,
  Gamepad
} from '@mui/icons-material'
import { Box, Collapse, IconButton, Stack, Tooltip } from '@mui/material'
import { useMatrixEditorContext } from '../MatrixEditorContext'
import DimensionSliders from './DimensionSliders'
import { useState } from 'react'
import useStore from '../../../../../store/useStore'
import Webcam from '../../../../../components/Webcam/Webcam'
import GroupControls from './GroupControls'

const MActionBar = ({
  virtual,
  camMapper,
  setCamMapper
}: {
  virtual: any
  camMapper: boolean
  setCamMapper: any
}) => {
  const {
    showPixelGraph,
    setShowPixelGraph,
    resetMatrix,
    clearMatrix,
    saveMatrix,
    rowN,
    colN,
    uniqueGroups
  } = useMatrixEditorContext()

  const [showSliders, setShowSliders] = useState(false)
  const [showGroupMove, setShowGroupMove] = useState(false)

  const features = useStore((state) => state.features)
  const getDevices = useStore((state) => state.getDevices)

  return (
    <Box>
      <Collapse in={camMapper}>
        {camMapper && (
          <Box
            sx={{
              pt: 2,
              pl: 2,
              borderTop: 1,
              borderColor: 'divider',
              backgroundColor: 'background.paper'
            }}
          >
            <Webcam rowN={rowN} colN={colN} />
          </Box>
        )}
      </Collapse>
      <Collapse in={showGroupMove}>
        <Box
          sx={{
            p: 1,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <GroupControls />
        </Box>
      </Collapse>
      <Collapse in={showSliders}>
        <Box
          sx={{
            pt: 2,
            pl: 2,
            borderTop: 1,
            borderColor: 'divider',
            backgroundColor: 'background.paper'
          }}
        >
          <DimensionSliders virtual={virtual} />
        </Box>
      </Collapse>
      <Box
        sx={{
          p: 0.5,
          borderTop: 1,
          borderColor: 'divider',
          backgroundColor: 'background.paper'
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={0.5}>
            <Tooltip title={showSliders ? 'Exit Resize' : 'Resize Matrix'}>
              <IconButton size="large" onClick={() => setShowSliders(!showSliders)}>
                {showSliders ? <Cancel /> : <Settings />}
              </IconButton>
            </Tooltip>

            {features.matrix_cam && (
              <>
                <Tooltip title={camMapper ? 'Exit CameraMapper' : 'Map Pixels via Camera'}>
                  <IconButton
                    className="step-2d-virtual-cam-toggle"
                    size="large"
                    onClick={() => {
                      getDevices()
                      setCamMapper(!camMapper)
                    }}
                  >
                    {camMapper ? <Cancel /> : <EmergencyRecording />}
                  </IconButton>
                </Tooltip>
              </>
            )}
            {uniqueGroups.length > 0 && (
              <>
                <Tooltip title={showGroupMove ? 'Exit Group Movement' : 'Move Groups via Buttons'}>
                  <IconButton size="large" onClick={() => setShowGroupMove(!showGroupMove)}>
                    {showGroupMove ? <Cancel /> : <Gamepad />}
                  </IconButton>
                </Tooltip>
              </>
            )}
          </Stack>

          <Stack direction="row" spacing={0.5}>
            <Tooltip title={showPixelGraph ? 'Hide Live Preview' : 'Show Live Preview'}>
              <IconButton size="large" onClick={() => setShowPixelGraph(!showPixelGraph)}>
                {showPixelGraph ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Reset to last saved state">
              <IconButton size="large" onClick={resetMatrix}>
                <Loop />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear Matrix">
              <IconButton size="large" onClick={clearMatrix}>
                <Delete />
              </IconButton>
            </Tooltip>
            <Tooltip title="Save Changes">
              <IconButton color="primary" size="large" onClick={saveMatrix}>
                <Save />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Box>
    </Box>
  )
}

export default MActionBar
