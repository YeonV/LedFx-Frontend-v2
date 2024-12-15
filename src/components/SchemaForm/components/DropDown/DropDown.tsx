import { EffectDropDownProps } from './DropDown.props'
import EffectTypeDialog from '../../../Dialogs/EffectTypeDialog'

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
  showFilter = false
}: EffectDropDownProps) => {
  return (
    <>
      <EffectTypeDialog
        title={title}
        value={value}
        onChange={onChange}
        groups={groups}
        showFilter={showFilter}
      />
    </>
  )
}

export default EffectDropDown
