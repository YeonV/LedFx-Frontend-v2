import Box from '@mui/material/Box'
import {
  Card,
  Collapse,
  IconButton,
  IconButtonProps,
  styled,
  Typography,
  useTheme
} from '@mui/material'
import useStore from '../../store/useStore'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme }) => ({
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  }),
  variants: [
    {
      props: ({ expand }) => !expand,
      style: {
        transform: 'rotate(0deg)'
      }
    },
    {
      props: ({ expand }) => !!expand,
      style: {
        transform: 'rotate(180deg)'
      }
    }
  ]
}))

const ExpanderCard = ({
  title,
  cardKey,
  children
}: {
  title: string
  cardKey: string
  children: React.ReactNode
}) => {
  const theme = useTheme()
  const setExpander = useStore((state) => state.setExpander)
  const expander = useStore((state) => state.uiPersist.expander)

  const handleExpandClick = () => {
    setExpander(cardKey, !expander[cardKey])
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 'unset' }}>
      <Typography
        onClick={handleExpandClick}
        color="GrayText"
        variant="h6"
        sx={{
          pl: 1,
          pt: 0.5,
          pb: 0.5,
          border: '1px solid',
          borderColor: theme.palette.divider,
          borderBottom: 0,
          justifyContent: 'space-between',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {title}
        <ExpandMore
          expand={expander[cardKey]}
          onClick={handleExpandClick}
          aria-expanded={expander[cardKey]}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Typography>
      <Collapse in={expander[cardKey]}>
        <Box
          sx={{ height: 208, width: '100%', maxWidth: '470px', m: '0 auto' }}
        >
          {children}
        </Box>
      </Collapse>
    </Card>
  )
}

export default ExpanderCard
