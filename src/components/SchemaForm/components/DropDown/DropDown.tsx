// import useEffect from 'react'
// import axios from 'axios'
import {
  EffectDropDownDefaultProps,
  EffectDropDownProps
} from './DropDown.props'
import EffectTypeDialog from '../../../Dialogs/EffectTypeDialog'

const EffectDropDown = ({
  value,
  onChange,
  groups,
  showFilter,
  title
}: EffectDropDownProps) => {
  return (
    <>
      {/* test */}
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
EffectDropDown.defaultProps = EffectDropDownDefaultProps

export default EffectDropDown
