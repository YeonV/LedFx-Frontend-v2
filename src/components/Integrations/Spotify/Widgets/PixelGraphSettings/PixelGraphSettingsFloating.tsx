import { Box, Divider, IconButton, MenuItem, Select, Stack, Typography } from '@mui/material'
import { Close } from '@mui/icons-material'
import { SettingsRow } from '../../../../../pages/Settings/SettingsComponents'
import PixelGraphsSettingsCard from '../../../../../pages/Settings/PixelGraphsSettingsCard'
import useStore from '../../../../../store/useStore'
import useStyle from './PgsFloating.styles'
import PgsFloating from './PgsFloating'
import { PixelGraphVariants } from '../../../../../store/ui-persist/storeUIpersist'

const PixelGraphSettingsFloating = ({ close }: { close?: () => void }) => {
  const classes = useStyle()
  const smoothing = useStore((state) => state.uiPersist.pixelGraphSettings?.smoothing)
  const round = useStore((state) => state.uiPersist.pixelGraphSettings?.round)
  const space = useStore((state) => state.uiPersist.pixelGraphSettings?.space)
  const stretch = useStore((state) => state.uiPersist.pixelGraphSettings?.stretch)
  const setPixelGraphSettings = useStore((state) => state.setPixelGraphSettings)
  const graphs = useStore((state) => state.graphs)
  const toggleGraphs = useStore((state) => state.toggleGraphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const toggleGraphsMulti = useStore((state) => state.toggleGraphsMulti)
  const showMatrix = useStore((state) => state.showMatrix)
  const toggleShowMatrix = useStore((state) => state.toggleShowMatrix)
  const variants = useStore((state) => state.uiPersist.pixelGraphSettings?.variants)
  return (
    <Box component={PgsFloating}>
      <div className={classes.Widget}>
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
          <Typography>PixelGraph Settings</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <Stack p={2} spacing={2}>
          <SettingsRow title="Graphs" step="zero" alpha>
            <Select
              sx={{ width: 150 }}
              disableUnderline
              value={variants}
              onChange={(e) => setPixelGraphSettings('variants', e.target.value)}
            >
              {PixelGraphVariants.map((variant) => (
                <MenuItem key={variant} value={variant}>
                  {variant}
                </MenuItem>
              ))}
            </Select>
          </SettingsRow>
          <Divider />
          <Typography align="center" variant="overline" color="textDisabled">
            Original Settings
          </Typography>
          <SettingsRow
            title="Rounded Pixels"
            checked={round}
            onChange={() => setPixelGraphSettings('round', !round)}
          />
          <SettingsRow
            title="Spacing between Pixels"
            checked={space}
            onChange={() => setPixelGraphSettings('space', !space)}
          />
          <Divider />
          <Typography align="center" variant="overline" color="textDisabled">
            Canvas Settings
          </Typography>
          <SettingsRow
            title="Smoothing"
            checked={smoothing}
            onChange={() => setPixelGraphSettings('smoothing', !smoothing)}
          />
          <SettingsRow
            title="Stretch in fill screen"
            checked={stretch}
            onChange={() => setPixelGraphSettings('stretch', !stretch)}
          />
          <Divider />
          <SettingsRow
            title="Show Graph on Device page (eats performance)"
            checked={graphs}
            onChange={() => toggleGraphs()}
          />
          <SettingsRow
            disabled={!graphs}
            title="Show Graphs on Devices page (eats even more performance)"
            checked={graphsMulti}
            onChange={() => toggleGraphsMulti()}
          />
          <SettingsRow
            disabled={!graphs}
            title="Show Matrix on Devices page (beta)"
            checked={showMatrix}
            onChange={() => toggleShowMatrix()}
          />
          <Divider />
          <PixelGraphsSettingsCard />
        </Stack>
      </div>
    </Box>
  )
}

export default PixelGraphSettingsFloating
