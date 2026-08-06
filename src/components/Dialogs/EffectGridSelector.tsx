import { useState, useMemo, forwardRef } from 'react'
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

// Ceiling on the column count. Past this, the tallest unbreakable category
// still sets the dialog height while extra columns only add empty space.
const MAX_COLUMNS = 4

// Column geometry. The dialog width is fixed: sizing it to the visible content
// was tried and reverted, because the search box filters on every keystroke and
// the dialog resized per character.
const COLUMN_GAP_PX = 16
const COLUMN_MIN_WIDTH_PX = 260

// Vertical space the dialog spends on everything that is not an effect row:
// the control bar, content padding, the dialog's own margin and a category
// header. Deliberately generous - overestimating just means slightly shorter
// rows, underestimating means the dialog scrolls when it did not need to.
// Dropped from 300 when the chips moved up into the control bar.
const CHROME_ALLOWANCE_PX = 260

// Row metrics. The floor is the original compact height, so a short window
// behaves exactly as before; the ceiling stops rows becoming absurd on a tall
// screen with few effects visible - revert ROW_MAX_PX to 44 for the previous,
// tighter look.
const ROW_MIN_PX = 29
const ROW_MAX_PX = 56
const ROW_GAP_PX = 3

// Label size follows the row height, so text does not float in a tall row.
// The floor is body2 (0.875rem), the size rows have always used, so a compact
// row is pixel-identical to before. The ratio is what a comfortable list row
// tends to want; the ceiling keeps it from shouting on very tall rows.
const ROW_FONT_RATIO = 0.34
const FONT_MIN_REM = 0.875
const FONT_MAX_REM = 1.125

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

  /**
   * The same effects, grouped back into category blocks in declared order.
   *
   * Each block is laid out as one unbreakable unit inside a CSS multi-column
   * flow, which is what keeps a category intact in a single column while still
   * letting the browser even out the column heights. Category sizes are very
   * uneven (Matrix has 21 effects, Simple has 2), so a fixed lane per category
   * would leave most of the dialog empty.
   */
  const categorisedEffects = useMemo(() => {
    const byCategory = new Map<string, Effect[]>()
    filteredEffects.forEach((effect) => {
      const category = effect.category || 'Non-Reactive'
      if (!byCategory.has(category)) byCategory.set(category, [])
      byCategory.get(category)!.push(effect)
    })

    const present = [...byCategory.keys()]
    const ordered = [
      ...categoryOrder.filter((c) => byCategory.has(c)),
      ...present.filter((c) => !categoryOrder.includes(c))
    ]

    // Largest category first. CSS column balancing is not an optimal packer: it
    // commits to column heights as it flows, so a big unbreakable block met
    // late (Matrix, 20 effects) forces one tall column after short ones have
    // already been settled. Leading with the big blocks lets the small ones
    // fill in around them. Ties keep the declared order.
    return ordered
      .map((category) => ({ category, effects: byCategory.get(category)! }))
      .sort((a, b) => b.effects.length - a.effects.length)
  }, [filteredEffects])

  /**
   * Rows the tallest column will end up holding, which is what the row height
   * has to divide into. Two things can set it: a single category too big to
   * share a column (Matrix), or the average once everything is spread over
   * MAX_COLUMNS. Whichever is larger wins.
   *
   * This is an estimate - the real column fill happens in the browser, after
   * layout - but it only needs to be close, because the result is clamped.
   */
  const rowsInTallestColumn = useMemo(() => {
    // Deliberately measured from the category chips only, ignoring the search
    // query. Search filters on every keystroke, so keying row height off it
    // would grow and shrink every row as you type. Chip toggles are discrete,
    // so they can safely drive layout; typing must not.
    const perCategory = new Map<string, number>()
    allEffects.forEach((effect) => {
      const category = effect.category || 'Non-Reactive'
      if (hiddenCategories.includes(category)) return
      perCategory.set(category, (perCategory.get(category) || 0) + 1)
    })
    if (!perCategory.size) return 1

    const counts = [...perCategory.values()]
    const largestBlock = Math.max(...counts) + 1
    const totalRows = counts.reduce((total, n) => total + n + 1, 0)
    return Math.max(largestBlock, Math.ceil(totalRows / MAX_COLUMNS))
  }, [allEffects, hiddenCategories])

  /**
   * Grow rows to use the vertical space that is actually there.
   *
   * Pure CSS on purpose: `100vh` re-evaluates on resize, so this tracks the
   * window without a resize listener or a re-render. Only the row count comes
   * from JS, and it changes only when the filters do.
   */
  const idealRow = `calc((100vh - ${CHROME_ALLOWANCE_PX}px) / ${rowsInTallestColumn} - ${ROW_GAP_PX}px)`
  const rowHeight = `clamp(${ROW_MIN_PX}px, ${idealRow}, ${ROW_MAX_PX}px)`

  // Derived from the row height via a custom property rather than recomputing
  // the clamp, so height and label size cannot drift apart.
  const rowFontSize =
    `clamp(${FONT_MIN_REM}rem, ` +
    `calc(var(--effect-row-h) * ${ROW_FONT_RATIO}), ` +
    `${FONT_MAX_REM}rem)`

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
          maxWidth: '1400px',
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
        {/*
          One control bar: close, title, category chips, search. Chips and
          search are both filters, so they belong in the same zone rather than
          stacked as two layers of chrome.

          Everything here wraps rather than using breakpoints. The chip group is
          the flexible item, so on a narrower dialog the chips wrap onto a
          second line inside the bar while search stays top-right; if it gets
          tighter still, the outer wrap drops search onto its own line.
        */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            columnGap: 2,
            rowGap: 1,
            p: 2,
            backgroundColor: 'transparent',
            borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'}`
          }}
        >
          <IconButton edge="start" onClick={onClose} aria-label="close">
            <Close />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flex: '0 0 auto' }}>
            {title}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 0.5,
              // takes the slack between title and search, and is allowed to
              // shrink below its content width so its own wrap kicks in first
              flex: '1 1 auto',
              minWidth: 0,
              // Chips sit against the search field, so the two filter controls
              // read as one group. Use 'flex-start' instead to park them next
              // to the title.
              justifyContent: 'flex-end'
            }}
          >
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
              flex: '0 0 auto',
              '& .MuiOutlinedInput-root': {
                backgroundColor: alpha(theme.palette.action.active, 0.04),
                '&:hover': {
                  backgroundColor: alpha(theme.palette.action.active, 0.08)
                }
              }
            }}
          />
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
                // single source of truth for row height; the label size is
                // derived from it further down
                '--effect-row-h': rowHeight,
                // Width AND count together, so count acts as a cap: at most
                // MAX_COLUMNS columns, each at least COLUMN_MIN_WIDTH_PX.
                // Capping matters because one category is ~3x the median - past
                // four columns the tallest block sets the height while the extra
                // columns just add empty space. On a narrow viewport the browser
                // drops to fewer columns on its own.
                columns: `${COLUMN_MIN_WIDTH_PX}px ${MAX_COLUMNS}`,
                columnGap: `${COLUMN_GAP_PX}px`,
                // the default, but explicit: it is the whole reason the columns
                // even out despite lopsided categories
                columnFill: 'balance'
              }}
            >
              {categorisedEffects.map(({ category, effects }) => {
                const categoryColor = getCategoryColor(category)

                return (
                  <Box
                    key={category}
                    sx={{
                      // keep a category whole in one column
                      breakInside: 'avoid',
                      WebkitColumnBreakInside: 'avoid',
                      pageBreakInside: 'avoid',
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        px: 1,
                        py: 0.5,
                        mb: 0.5,
                        borderRadius: 1,
                        backgroundColor: categoryColor
                      }}
                    >
                      <Typography
                        variant="subtitle2"
                        sx={{
                          fontWeight: 700,
                          color: theme.palette.text.primary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          fontSize: '0.72rem',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {category}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: alpha(theme.palette.text.primary, 0.7) }}
                      >
                        {effects.length}
                      </Typography>
                    </Box>

                    {effects.map((effect) => {
                      const isSelected = effect.id === value

                      return (
                        <Card
                          key={effect.id}
                          sx={{
                            mb: `${ROW_GAP_PX}px`,
                            borderRadius: 1,
                            overflow: 'hidden',
                            // A tint rather than a solid block: the header
                            // already carries the category, so rows stay
                            // readable and the column reads as one lane.
                            backgroundColor: isSelected
                              ? alpha(theme.palette.primary.main, 0.3)
                              : alpha(categoryColor, 0.35),
                            borderLeft: `3px solid ${
                              isSelected ? theme.palette.primary.main : categoryColor
                            }`,
                            transition: 'background-color 0.12s ease',
                            '&:hover': {
                              backgroundColor: isSelected
                                ? alpha(theme.palette.primary.main, 0.4)
                                : alpha(categoryColor, 0.7)
                            }
                          }}
                        >
                          <CardActionArea
                            onClick={() => handleEffectSelect(effect.id)}
                            sx={{
                              px: 1,
                              py: 0.5,
                              minHeight: 'var(--effect-row-h)',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <CardContent
                              sx={{
                                p: 0,
                                width: '100%',
                                minWidth: 0,
                                '&:last-child': { pb: 0 }
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  fontWeight: isSelected ? 700 : 400,
                                  color: theme.palette.text.primary,
                                  fontSize: rowFontSize,
                                  lineHeight: 1.3,
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
