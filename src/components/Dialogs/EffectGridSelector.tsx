import { useState, useMemo } from 'react'
import {
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Slide,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
  alpha,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Chip
} from '@mui/material'
import { Close, Search } from '@mui/icons-material'
import { TransitionProps } from '@mui/material/transitions'
import { forwardRef } from 'react'

interface Effect {
  id: string
  name: string
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
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const categoryOrder = useMemo(
    () => ['Non-Reactive', 'BPM', 'Classic', 'Atmospheric', '2D', 'Matrix', 'Diagnostic'],
    []
  )

  const categoryColors: Record<string, { bg: string; chip: string }> = {
    'Non-Reactive': { bg: '#3a3d50', chip: '#4B4E6B' },
    BPM: { bg: '#545c64', chip: '#6A757E' },
    Classic: { bg: '#4a5568', chip: '#5C6B7E' },
    Atmospheric: { bg: '#3f4a59', chip: '#4F5A69' },
    '2D': { bg: '#4a4e69', chip: '#5A5E79' },
    Matrix: { bg: '#3d405b', chip: '#4D506B' },
    Diagnostic: { bg: '#2d3748', chip: '#3D4758' }
  }

  const handleCategoryChange = (_: React.MouseEvent<HTMLElement>, newCategories: string[]) => {
    setSelectedCategories(newCategories)
  }

  const filteredGroups = useMemo(() => {
    if (!groups) return {}

    const result: { [key: string]: Effect[] } = {}

    Object.keys(groups).forEach((category) => {
      const effects = groups[category].filter((effect) => {
        const matchesSearch =
          searchQuery === '' ||
          effect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          category.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesCategory =
          selectedCategories.length === 0 || selectedCategories.includes(category)

        return matchesSearch && matchesCategory
      })

      if (effects.length > 0) {
        result[category] = effects
      }
    })

    return result
  }, [groups, searchQuery, selectedCategories])

  const handleEffectSelect = (effectId: string) => {
    onChange(effectId)
    onClose()
  }

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      sx={{
        '& .MuiDialog-paper': {
          backgroundColor: theme.palette.background.default
        }
      }}
    >
      <AppBar
        sx={{
          position: 'relative',
          backgroundColor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.9)
              : alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
          color: theme.palette.text.primary,
          boxShadow: 'none',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}
      >
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
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
              mr: 2,
              minWidth: 250,
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.action.active, 0.04),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.active, 0.08)
                }
              }
            }}
          />
        </Toolbar>
        <Box sx={{ px: 2, pb: 2 }}>
          <ToggleButtonGroup
            value={selectedCategories}
            onChange={handleCategoryChange}
            aria-label="categories"
            size="small"
            sx={{
              flexWrap: 'wrap',
              gap: 0.5,
              '& .MuiToggleButton-root': {
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: '16px !important',
                px: 2,
                py: 0.5,
                fontSize: '0.75rem',
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  color: theme.palette.primary.main,
                  borderColor: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.25)
                  }
                }
              }
            }}
          >
            <ToggleButton value="" aria-label="all">
              All
            </ToggleButton>
            {categoryOrder.map((category) => (
              <ToggleButton key={category} value={category} aria-label={category}>
                {category}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>
      </AppBar>

      <DialogContent
        sx={{
          p: 3,
          overflowY: 'auto',
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
        {Object.keys(filteredGroups).length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '50vh',
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
          Object.entries(filteredGroups)
            .sort(([a], [b]) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b))
            .map(([category, effects]) => {
              const colors = categoryColors[category] || {
                bg: theme.palette.mode === 'dark' ? '#2d2d2d' : '#f5f5f5',
                chip: theme.palette.mode === 'dark' ? '#3d3d3d' : '#e0e0e0'
              }

              return (
                <Box key={category} sx={{ mb: 4 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      mb: 2
                    }}
                  >
                    <Chip
                      label={category}
                      size="small"
                      sx={{
                        backgroundColor: colors.chip,
                        color: theme.palette.text.primary,
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                      ({effects.length})
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(4, 1fr)',
                        lg: 'repeat(6, 1fr)'
                      },
                      gap: 1.5
                    }}
                  >
                    {effects.map((effect) => {
                      const isSelected = effect.id === value

                      return (
                        <Card
                          key={effect.id}
                          sx={{
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.15)
                              : colors.bg,
                            border: isSelected
                              ? `2px solid ${theme.palette.primary.main}`
                              : `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                            transition: 'all 0.2s ease',
                            overflow: 'hidden',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: theme.shadows[4],
                              borderColor: theme.palette.primary.main
                            }
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleEffectSelect(effect.id)}
                            sx={{
                              height: '100%',
                              p: 1.5
                            }}
                          >
                            <CardContent
                              sx={{
                                p: '8px !important',
                                '&:last-child': {
                                  pb: '8px !important'
                                }
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 600 : 400,
                                  color: theme.palette.text.primary,
                                  textAlign: 'center',
                                  lineHeight: 1.3,
                                  fontSize: '0.8rem'
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
                </Box>
              )
            })
        )}
      </DialogContent>
    </Dialog>
  )
}

export default EffectGridSelector
