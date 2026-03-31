import { useState } from 'react'
import { Typography } from '@mui/material'
import { ArrowDropDown } from '@mui/icons-material'
import { EffectDropDownProps } from './DropDown.props'
import EffectTypeDialog from '../../../Dialogs/EffectTypeDialog'
import EffectGridSelector from '../../../Dialogs/EffectGridSelector'
import BladeFrame from '../BladeFrame'

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
  viewMode = 'list'
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
          <BladeFrame
            title={title}
            onClick={() => setGridOpen(true)}
            style={{
              cursor: 'pointer',
              marginBottom: 0,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 0
            }}
          >
            <Typography
              variant="body1"
              sx={{
                flexGrow: 1,
                padding: '16px 1.2rem 14px 1.2rem',
                borderRadius: '10px',
                border: '1px solid #666666',
                '&:hover': {
                  border: '1px solid #f9f9fb'
                }
              }}
            >
              {allEffects?.name || 'Choose Effect'}
              <ArrowDropDown
                sx={{
                  position: 'absolute',
                  right: 10,
                  top: 16,
                  paddingBottom: 1,
                  fontSize: 30,
                  zIndex: 0
                }}
              />
            </Typography>
          </BladeFrame>
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
