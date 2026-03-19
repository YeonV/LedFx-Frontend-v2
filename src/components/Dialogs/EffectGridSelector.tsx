import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Slide,
  ToggleButton,
  useTheme,
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent
} from '@mui/material'
import { Close, Search } from '@mui/icons-material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef } from 'react'

interface Effect {
  id: string
  name: string
  category?: string
}

interface EffectGridSelectorProps {
  open: boolean
  onClose: () => void
  value: string
  onChange: (effectId: string) => void
  groups?: { [key: string]: Effect[] }
  title?: string
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const categoryColors: Record<string, string> = {
  'Non-Reactive': '#4B4E6B',
  BPM: '#6A757E',
  Classic: '#4F3E4C',
  Atmospheric: '#3E4B65',
  '2D': '#505758',
  Matrix: '#2B3A42',
  Diagnostic: '#8A4C6C',
  Simple: '#5C6B7E'
}

const defaultColors = [
  '#4B4E6B',
  '#6A757E',
  '#4F3E4C',
  '#3E4B65',
  '#505758',
  '#2B3A42',
  '#8A4C6C',
  '#5C6B7E'
]

const categoryOrder = [
  'Non-Reactive',
  'BPM',
  'Classic',
  'Atmospheric',
  '2D',
  'Matrix',
  'Simple',
  'Diagnostic'
]

const EffectGridSelector = ({
  open,
  onClose,
  value,
  onChange,
  groups,
  title = 'Select Effect'
}: EffectGridSelectorProps) => {
  const theme = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [hiddenCategories, setHiddenCategories] = useState<string[]>([])

  const allEffects = useMemo(() => {
    if (!groups) return []

    const effects: Effect[] = []
    Object.keys(groups).forEach((category) => {
      groups[category].forEach((effect: any) => {
        effects.push({ ...effect, category })
      })
    })
    return effects
  }, [groups])

  const filteredEffects = useMemo(() => {
    const filtered = allEffects.filter((effect) => {
      const matchesSearch =
        searchQuery === '' ||
        effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (effect.category && effect.category.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = effect.category && !hiddenCategories.includes(effect.category)

      return matchesSearch && matchesCategory
    })

    const order = categoryOrder.filter((c) => filtered.some((e) => e.category === c))
    const others = [
      ...new Set(
        filtered.filter((e) => !order.includes(e.category || '')).map((e) => e.category || '')
      )
    ]

    return [...filtered].sort((a, b) => {
      const aOrder = order.indexOf(a.category || '')
      const bOrder = order.indexOf(b.category || '')
      if (aOrder !== -1 && bOrder !== -1) return aOrder - bOrder
      if (aOrder !== -1) return -1
      if (bOrder !== -1) return 1
      const aOthers = others.indexOf(a.category || '')
      const bOthers = others.indexOf(b.category || '')
      return aOthers - bOthers
    })
  }, [allEffects, searchQuery, hiddenCategories])

  const toggleCategory = (category: string) => {
    setHiddenCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    )
  }

  const handleEffectSelect = (effectId: string) => {
    onChange(effectId)
    onClose()
  }

  const getCategoryColor = useMemo(() => {
    return (category: string) => {
      if (categoryColors[category]) return categoryColors[category]
      const hash = category.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      return defaultColors[hash % defaultColors.length]
    }
  }, [])

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth={false}
      sx={{
        '& .MuiDialog-paper': {
          width: '80vw',
          maxWidth: 'none',
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: 2
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          border: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            backgroundColor: 'transparent',
            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
          }}
        >
          <IconButton edge="start" onClick={onClose} aria-label="close" sx={{ mr: 2 }}>
            <Close />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flex: 1 }}>
            {title}
          </Typography>
          <TextField
            placeholder="Search effects..."
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.action.active, 0.04),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.active, 0.08)
                }
              }
            }}
          />
        </Box>
        <Box sx={{ px: 2, py: 1.5, backgroundColor: 'transparent' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {(categoryOrder.filter((c) => groups && Object.keys(groups).includes(c)).length > 0
              ? categoryOrder.filter((c) => groups && Object.keys(groups).includes(c))
              : Object.keys(groups || {})
            ).map((category) => {
              const isVisible = !hiddenCategories.includes(category)
              const chipColor = getCategoryColor(category)
              return (
                <ToggleButton
                  key={category}
                  value={category}
                  aria-label={category}
                  selected={isVisible}
                  onClick={() => toggleCategory(category)}
                  sx={{
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: '16px',
                    px: 1.5,
                    py: 0.5,
                    textTransform: 'none',
                    color: theme.palette.text.primary,
                    backgroundColor: isVisible ? chipColor : 'transparent',
                    '&.Mui-selected': {
                      backgroundColor: chipColor,
                      '&:hover': {
                        backgroundColor: chipColor
                      }
                    },
                    '&:hover': {
                      backgroundColor: isVisible ? chipColor : alpha(chipColor, 0.15)
                    }
                  }}
                >
                  {category}
                </ToggleButton>
              )
            })}
          </Box>
        </Box>

        <DialogContent
          sx={{
            p: 2,
            flex: 1,
            overflowY: 'auto',
            backgroundColor: 'transparent',
            '&::-webkit-scrollbar': {
              width: '8px'
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent'
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: theme.palette.divider,
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: theme.palette.action.hover
              }
            }
          }}
        >
          {filteredEffects.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                flexDirection: 'column',
                gap: 2
              }}
            >
              <Typography variant="h6" color="text.secondary">
                No effects found
              </Typography>
              <Typography variant="body2" color="text.disabled">
                Try adjusting your search or filters
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                gap: 0.75
              }}
            >
              {filteredEffects.map((effect) => {
                const isSelected = effect.id === value
                const bgColor = getCategoryColor(effect.category || 'Non-Reactive')

                return (
                  <Card
                    key={effect.id}
                    sx={{
                      backgroundColor: isSelected
                        ? alpha(theme.palette.primary.main, 0.3)
                        : bgColor,
                      border: isSelected
                        ? `2px solid ${theme.palette.primary.main}`
                        : `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                      transition: 'all 0.15s ease',
                      overflow: 'hidden',
                      '&:hover': {
                        transform: 'scale(1.03)',
                        boxShadow: theme.shadows[3],
                        borderColor: theme.palette.primary.main
                      }
                    }}
                  >
                    <CardActionArea
                      onClick={() => handleEffectSelect(effect.id)}
                      sx={{
                        height: '100%',
                        px: 0.5,
                        py: 1
                      }}
                    >
                      <CardContent
                        sx={{
                          p: '2px',
                          '&:last-child': {
                            pb: '2px'
                          }
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            fontWeight: isSelected ? 600 : 400,
                            color: theme.palette.text.primary,
                            textAlign: 'center',
                            lineHeight: 1.2,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {effect.name}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                )
              })}
            </Box>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  )
}

export default EffectGridSelector
