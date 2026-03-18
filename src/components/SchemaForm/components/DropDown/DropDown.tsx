import { useState } from 'react'
import { TextField, InputAdornment } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import { EffectDropDownProps } from './DropDown.props'
import EffectTypeDialog from '../../../Dialogs/EffectTypeDialog'
import EffectGridSelector from '../../../Dialogs/EffectGridSelector'

const EffectDropDown = ({
  value = '',
  onChange = undefined,
  title = 'Effect Type',
  groups = {
    'Group 1': [
      {
        name: 'Item 1',
        id: 'item1',
        category: 'Group 1'
      },
      {
        name: 'Item2',
        id: 'item2',
        category: 'Group 1'
      }
    ],
    'Group 2': [
      {
        name: 'Item 1',
        id: 'item11',
        category: 'Group 2'
      }
    ]
  },
  showFilter = false,
  viewMode = 'grid'
}: EffectDropDownProps) => {
  const [gridOpen, setGridOpen] = useState(false)

  // Flatten groups to get the display label
  const allEffects = Object.values(groups || {})
    .flat()
    .find((e: any) => e.id === value) as { id: string; name: string } | undefined

  const handleGridChange = (effectId: string) => {
    if (onChange) {
      const fakeEvent = { target: { value: effectId } }
      onChange(fakeEvent as any)
    }
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <>
          {/* Grid View - Clickable TextField trigger */}
          <TextField
            label={title}
            value={allEffects?.name || ''}
            onClick={() => setGridOpen(true)}
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <ArrowDropDown />
                </InputAdornment>
              ),
              sx: { cursor: 'pointer' }
            }}
            inputProps={{
              style: { cursor: 'pointer' }
            }}
          />

          <EffectGridSelector
            open={gridOpen}
            onClose={() => setGridOpen(false)}
            value={value}
            onChange={handleGridChange}
            groups={groups}
            title={title}
          />
        </>
      ) : (
        /* List View - Original Autocomplete Dialog */
        <EffectTypeDialog
          title={title}
          value={value}
          onChange={onChange}
          groups={groups}
          showFilter={showFilter}
        />
      )}
    </>
  )
}

export default EffectDropDown
