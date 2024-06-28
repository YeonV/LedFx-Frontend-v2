import { Alert, Box, Collapse } from '@mui/material'
import useStore from '../../../../store/useStore'

const MWrapper = ({ children }: any) => {
  const infoAlerts = useStore((state) => state.ui.infoAlerts)

  const setInfoAlerts = useStore((state) => state.ui.setInfoAlerts)
  console.log(window.screen.orientation.type)
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:
          window.screen.orientation.type.split('-')[0] === 'landscape'
            ? 'row'
            : 'column',
        maxHeight: '90vh',
        '& .react-transform-wrapper': {
          flexGrow: 1
        }
      }}
    >
      {infoAlerts.matrix && (
        <Collapse in={infoAlerts.matrix}>
          <Alert
            severity="info"
            sx={{ width: 500, marginBottom: 2 }}
            onClose={() => {
              setInfoAlerts('matrix', false)
            }}
          >
            <strong>Concept Draft</strong>
            <ul style={{ padding: '0 1rem' }}>
              <li>Use Mousewheel to Zoom</li>
              <li>Use left-click with drag&drop to move around</li>
              <li>Use right-click to assign Pixels</li>
            </ul>
          </Alert>
        </Collapse>
      )}
      {children}
    </Box>
  )
}

export default MWrapper
