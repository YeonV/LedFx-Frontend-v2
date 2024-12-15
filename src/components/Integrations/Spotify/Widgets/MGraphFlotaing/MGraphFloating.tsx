import { Box, IconButton, Stack, Typography } from '@mui/material'

import useStyle from './MgFloating.styles'
import MgFloating from './MgFloating'
import MGraph from '../../../../MGraph'
import { Close } from '@mui/icons-material'

const MGraphFloating = ({ close }: { close?: () => void }) => {
  const classes = useStyle()

  return (
    <Box component={MgFloating}>
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
          <Typography>Audio Graph</Typography>
          {close && (
            <IconButton onClick={() => close()}>
              <Close />
            </IconButton>
          )}
        </Stack>
        <MGraph />
      </div>
    </Box>
  )
}

export default MGraphFloating
