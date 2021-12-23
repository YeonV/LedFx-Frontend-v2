import { useState } from 'react';
import useStore from '../../utils/apiStore';
import { Link, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography, Paper } from '@material-ui/core';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import { useTheme } from '@material-ui/core/styles';

const SmartBar = ({ open, setOpen }) => {
  const theme = useTheme();
  const virtuals = useStore(state => state.virtuals)
  const scenes = useStore(state => state.scenes)
  const activateScene = useStore((state) => state.activateScene);
  const setFeatures = useStore((state) => state.setFeatures);
  const setShowFeatures = useStore((state) => state.setShowFeatures);
  const features = useStore((state) => state.features);
  const setViewMode = useStore((state) => state.setViewMode);

  const filterOptions = createFilterOptions({
    stringify: (option) => Object.keys(option).indexOf('is_device') > -1 ? `device ${option.config.name}` : `scene ${option.name}`
  });

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog PaperProps={{style:{
      alignSelf: 'flex-start',
      marginTop: '75px'
    }}} open={open} onClose={handleClose} aria-labelledby="form-dialog-title" >
      <div style={{ width: 500, height: 80, padding: 10, overflow: 'hidden' }}>
        <Autocomplete
          autoFocus
          autoComplete
          openOnFocus
          // open={true}
          // disableCloseOnSelect
          id="smartbar-autocomplete"
          sx={{ width: 480, height: 50 }}
          options={[...Object.values(virtuals), ...Object.values(scenes)]}
          autoHighlight
          popupIcon={null}
          filterOptions={filterOptions}
          getOptionLabel={(option) => Object.keys(option).indexOf('is_device') > -1 ? option.config.name : option.name}
          onChange={(event, value, reason, details) => {
            if (value && typeof value === 'object') {
              if (Object.keys(value).indexOf('is_device') > -1) {
                window.location.href = `${window.location.origin}/#/device/${value.id}`
              } else {
                activateScene({ id: Object.entries(scenes).filter(([k, v]) => v.name === value.name)[0][0] })
              }
            }
            handleClose()
          }}
          onInputChange={(event, value) => {
            if (value === 'HackedByBlade!') {
              alert("DevMode activated!")
              setFeatures('dev', true)
            }
            if (features['dev']) {
              if (value === 'clear') { setViewMode('user'); setShowFeatures('dev', false); setShowFeatures('go', false); setShowFeatures('streamto', false); setShowFeatures('waves', false);setShowFeatures('effectfilter', false); setShowFeatures('cloud', false); setShowFeatures('wled', false); setShowFeatures('integrations', false); setShowFeatures('spotify', false); setShowFeatures('webaudio', false); setFeatures('streamto', false); setFeatures('go', false); setFeatures('waves', false); setFeatures('cloud', false);setFeatures('effectfilter', false); setFeatures('wled', false); setFeatures('dev', false); setFeatures('integrations', false); setFeatures('spotify', false); setFeatures('webaudio', false); window.localStorage.removeItem('ledfx-theme'); window.localStorage.setItem('BladeMod', 0); window.location.reload() }
              if (value === 'BladeCloud') { setShowFeatures('cloud', true) }
              if (value === 'BladeWled') { setShowFeatures('wled', true) }
              if (value === 'BladeIntegrations') { setShowFeatures('integrations', true) }
              if (value === 'BladeSpotify') { setShowFeatures('spotify', true) }
              if (value === 'BladeWebaudio') { setShowFeatures('webaudio', true) }
              if (value === 'BladeWaves') { setShowFeatures('waves', true) }
              if (value === 'BladeStreamTo') { setShowFeatures('streamto', true) }
              if (value === 'BladeEffectFilter') { setShowFeatures('effectfilter', true) }
              if (value === 'BladeGo') { setShowFeatures('go', true) }
              if (value.startsWith('theme:') && ["DarkRed", "DarkOrange", "Light", "DarkGreen", "DarkBlue", "DarkGrey"].indexOf(value.replace('theme:', '')) > -1) { window.localStorage.setItem('ledfx-theme', value.replace('theme:', '')); window.location.reload() }
            }
            if (value === 'BladeIsYeon') { setViewMode('expert'); setShowFeatures('dev', true); setShowFeatures('go', true); setShowFeatures('streamto', true); setShowFeatures('cloud', true);setShowFeatures('effectfilter', true); setShowFeatures('waves', true); setShowFeatures('wled', true); setShowFeatures('integrations', true); setShowFeatures('spotify', true); setShowFeatures('webaudio', true); setFeatures('streamto', true); setFeatures('go', true); setFeatures('waves', true); setFeatures('cloud', true); setFeatures('wled', true); setFeatures('integrations', true);setFeatures('effectfilter', true); setFeatures('spotify', true); setFeatures('webaudio', true); window.localStorage.setItem('ledfx-theme', "DarkRed"); window.location.reload() }

          }}
          renderOption={(props, option) => (
            <Box component="li" {...props} sx={{ color: theme.palette.text.secondary, width: '100%', padding: '5px 50px', '&&&': { justifyContent: 'space-between' } }} >
              <Typography variant={"body1"}> {option.config?.name || option.name} </Typography>
              <div>
                <Typography style={{ opacity: 0.6 }} variant={"caption"}>{Object.keys(option).indexOf('is_device') > -1 ? 'jump to ' : 'activate '}</Typography>
                <Typography style={{ opacity: 0.6, border: '1px solid', borderRadius: 5, padding: '2px 5px' }} variant={"caption"}>{Object.keys(option).indexOf('is_device') > -1 ? 'Device' : 'Scene'}</Typography>
              </div>
            </Box>
          )}
          PaperComponent={({ children }) => (
            <Paper style={{ width: 500, marginLeft: -10, background: theme.palette.background.paper }}>{children}</Paper>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              autoFocus
              variant={"outlined"}
              color={"primary"}
              label="Jump to device / Activate scene"
              inputProps={{
                ...params.inputProps,
                autoComplete: "off", // disable autocomplete and autofill
              }}
            />
          )}
        />
      </div>
    </Dialog>
  )
}

export default SmartBar
