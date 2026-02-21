import { makeStyles, styled } from '@mui/styles'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Slider,
  Switch,
  type SxProps,
  type Theme,
  Tooltip,
  Typography,
  useTheme
} from '@mui/material'
import { ExpandMore, Info } from '@mui/icons-material'
// import { ChevronRight, ExpandMore } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'

export const useStyles = makeStyles(() => ({
  content: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
    '&>div': {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between'
    }
  },
  settingsRow: {
    order: 'unset',
    width: '100%',
    justifyContent: 'space-between',
    display: 'flex',
    alignItems: 'center',
    height: 40,
    '&>label': {
      marginRight: '1rem'
    },
    '&.slider>label': {
      width: 150
    }
  },
  actionButton: {
    marginTop: '0.5rem',
    flexBasis: '49%',
    width: '100%',
    borderColor: '#444'
  },
  card: {
    maxWidth: '540px',
    margin: '1rem auto 0' // mobile
  },
  '@media (max-width: 580px)': {
    card: {
      maxWidth: '97vw',
      margin: '0 auto'
    }
  },
  audioCard: {
    '& > div > div:not(:last-child)': {
      '@media (max-width: 580px)': {
        width: '48% !important',
        minWidth: 'unset'
      }
    }
  }
}))

export const SettingsStylesSlider = styled(Slider)(({ theme }: any) => ({
  color: '#eeeeee',
  height: 2,
  padding: '15px 0',
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)',
    '&:focus, &:hover, &.Mui-active': {
      boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
      // Reset on touch devices, it doesn't add specificity
      '@media (hover: none)': {
        boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)'
      }
    }
  },
  '& .MuiSliderValueLabel ': {
    fontSize: 12,
    fontWeight: 'normal',
    top: -6,
    backgroundColor: 'unset',
    color: theme.palette.text.primary,
    '&:before': {
      display: 'none'
    },
    '& *': {
      background: 'transparent',
      color: '#000',
      ...theme.applyStyles('dark', {
        color: '#fff'
      })
    }
  },
  '& .MuiSlider-track': {
    border: 'none'
  },
  '& .MuiSlider-rail': {
    opacity: 0.5,
    backgroundColor: '#bfbfbf'
  },
  '& .MuiSlider-mark': {
    backgroundColor: '#bfbfbf',
    height: 8,
    width: 1,
    '&.MuiSlider-markActive': {
      opacity: 1,
      backgroundColor: 'currentColor'
    }
  }
}))

export const SettingsSlider = (props: any) => (
  <div style={{ flexGrow: 1 }}>
    <SettingsStylesSlider {...props} />
  </div>
)

export const SettingsSwitch = styled(Switch)(({ theme }: any) => ({
  width: 50,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(24px)',
      color: theme.palette.primary.main === '#FFFFFF' ? '#000' : '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.primary,
        opacity: 1,
        border: 0
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5
      }
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff'
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[600],

      ...theme.applyStyles('light', {
        color: theme.palette.grey[100]
      })
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.3,

      ...theme.applyStyles('light', {
        opacity: 0.7
      })
    }
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#39393D',
    opacity: 1,

    transition: theme.transitions.create(['background-color'], {
      duration: 500
    }),

    ...theme.applyStyles('light', {
      backgroundColor: '#E9E9EA'
    })
  }
}))

export const SettingsButton = (props: any) => {
  const classes = useStyles()
  return <Button size="small" className={classes.actionButton} {...props} />
}

export const SettingsRow = ({
  title = '',
  step = 'x',
  children = null,
  checked = false,
  onChange,
  style = null,
  disabled = false,
  expert = false,
  beta = false,
  alpha = false,
  info = null
}: {
  step?: string
  title: string
  checked?: boolean

  onChange?: (e: any) => void
  children?: any
  style?: any
  disabled?: boolean
  expert?: boolean
  beta?: boolean
  alpha?: boolean
  info?: string | null
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const alphaMode = useStore((state) => state.features.alpha)
  const betaMode = useStore((state) => state.features.beta)
  const expertMode = useStore((state) => state.viewMode) === 'expert'
  const match = title.match(/(.*?)(\s*\(.*?\))/)
  const mainText = match ? match[1] : title
  const bracketText = match ? match[2] : ''
  if (beta && !betaMode) return null
  if (alpha && !alphaMode) return null
  if (expert && !expertMode) return null

  return (
    <div
      className={`${classes.settingsRow} step-settings-${step} `}
      style={{
        ...style,
        color: disabled ? theme.palette.text.disabled : theme.palette.text.primary
      }}
    >
      <label>
        {mainText}
        {bracketText && (
          <Typography variant="caption" color="textDisabled">
            &nbsp;{bracketText}
          </Typography>
        )}
      </label>
      {alpha && <Chip size="small" label="alpha" disabled />}
      {beta && <Chip size="small" label="beta" disabled />}
      {expert && <Chip size="small" label="expert" disabled />}
      <div
        style={{
          display: 'flex',
          color: disabled ? '#000' : '#7b7a7c',
          flexGrow: 1,
          justifyContent: 'flex-end',
          alignItems: 'center',
          textAlign: 'right'
        }}
      >
        {info && (
          <Tooltip title={info}>
            <Info fontSize="small" sx={{ mr: 2 }} />
          </Tooltip>
        )}
        {children ||
          (title === 'Beta Mode' ? (
            <Tooltip title="AlphaMode: Smartbar -> HackedByBlade! -> OK -> BladeAlpha">
              <SettingsSwitch disabled={disabled} checked={checked} onChange={onChange} />
            </Tooltip>
          ) : title === 'Gamepad' ? (
            <Tooltip title="Press Start button on your gamepad. Else try other buttons :)">
              <SettingsSwitch disabled={disabled} checked={checked} onChange={onChange} />
            </Tooltip>
          ) : (
            <SettingsSwitch disabled={disabled} checked={checked} onChange={onChange} />
          ))}
      </div>
    </div>
  )
}

export const SettingsAccordion = ({
  title,
  accId,
  children,
  icon = '',
  sx
}: {
  title: string
  accId: string
  children: any

  icon?: string
  sx?: SxProps<Theme> | undefined
}) => {
  const settingsExpanded = useStore((state) => state.ui.settingsExpanded)
  const setSettingsExpanded = useStore((state) => state.ui.setSettingsExpanded)
  const handleExpanded = (panel: any, _event: any, isExpanded: any) => {
    setSettingsExpanded(isExpanded ? panel : false)
  }
  return (
    <Accordion
      onDoubleClick={() => setSettingsExpanded('all')}
      expanded={settingsExpanded === 'all' || settingsExpanded === `panel${accId}`}
      onChange={(event, isExpanded) => handleExpanded(`panel${accId}`, event, isExpanded)}
      sx={sx}
    >
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`panel${accId}-content`}
        id={`panel${accId}-header`}
      >
        {icon && icon !== '' ? <BladeIcon name={icon} style={{ marginRight: '0.75rem' }} /> : <></>}
        <Typography>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  )
}
