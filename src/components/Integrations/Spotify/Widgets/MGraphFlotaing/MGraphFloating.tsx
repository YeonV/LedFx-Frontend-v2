import { Box } from '@mui/material'

import useStyle from './MgFloating.styles'
import MgFloating from './MgFloating'
import MGraph from '../../../../MGraph'

const MGraphFloating = () => {
  const classes = useStyle()

  return (
    <Box component={MgFloating}>
      <div className={classes.Widget}>
        <Box
          bgcolor="#111"
          height={50}
          alignItems="center"
          justifyContent="center"
          display="flex"
        >
          Audio Graph
        </Box>
        <MGraph />
      </div>
    </Box>
  )
}

export default MGraphFloating
