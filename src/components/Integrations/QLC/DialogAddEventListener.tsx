/* eslint-disable prettier/prettier */
import React from 'react'
import { styled } from '@mui/material/styles'
// import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Dialog from '@mui/material/Dialog'
import AddCircleIcon from '@mui/icons-material/AddCircle'
// import {SchemaForm, utils}  from 'react-schema-form';
import DialogContentText from '@mui/material/DialogContentText'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import ListSubheader from '@mui/material/ListSubheader'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { Slider, Switch } from '@mui/material'
import FormHelperText from '@mui/material/FormHelperText'
import ThisDropDown from './DialogAddEventListnerDropDown'
// import { createQlcListener } from 'modules/qlc';
import useStore from '../../../store/useStore'

const PREFIX = 'DialogAddEventListener'

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`,
}

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.paper}`]: {
    width: '80%',
    maxHeight: 535,
  },
}))

function ConfirmationDialogRaw(props: any) {
  const {
    onClose,
    value: valueProp,
    open,
    // deviceList,
    ...other
  } = props
  const [valueState, setValue] = React.useState(valueProp)
  const [checkButtonType, setButtonType] = React.useState(false)
  const [checkSliderType, setSliderType] = React.useState(false)
  const [checkID, setID] = React.useState(null)
  const [dropDownRenderList, setdropDownRenderList] = React.useState([])
  const [switchValue, setSwitchValue] = React.useState(false)
  const [sliderValue, setSliderValue] = React.useState(0)
  const [formData, setformData] = React.useState({
    event_type: null,
    event_filter: { scene_id: null },
    qlc_payload: null,
  })
  const [qlcData, setqlcData] = React.useState([])
  const radioGroupRef = React.useRef(null)
  // const [model, setModel] = React.useState({});

  const qlcInfo = useStore((state: any) => state.qlc?.qlcWidgets)
  const createQlcListener = useStore((state) => state.addQLCSongTrigger)
  const getIntegrations = useStore((state) => state.getIntegrations)

  // console.log("qlcInfo - Response: ", qlcInfo);
  //  const effectNames = qlcInfo && qlcInfo.event_types && qlcInfo.event_types.effect_set.event_filters.effect_name
  // const effectCleared = qlcInfo && qlcInfo.event_types && qlcInfo.event_types.effect_cleared.event_name

  const SceneSet =
    qlcInfo &&
    qlcInfo?.event_types &&
    qlcInfo?.event_types?.scene_activated?.event_filters?.scene_id
  const temp = (qlcInfo && qlcInfo?.qlc_widgets) || []

  const QLCWidgets =
    temp.length > 0
      ? [...temp].sort(
        (a: string[], b: string[]) => parseInt(a[0], 10) - parseInt(b[0], 10)
      )
      : []

  // const EVENT_TYPES= qlcInfo && qlcInfo.event_types && qlcInfo.event_types
  // console.log("test3",EVENT_TYPES);
  // const qlcStuff = [];
  // const qlcID = {} as any;
  // const qlcType = {}
  // qlcInfo &&
  //   qlcInfo?.qlc_widgets &&
  //   qlcInfo?.qlc_widgets?.length &&
  //   qlcInfo?.qlc_widgets?.map((a: any) => {
  //     qlcStuff[a[0]] = { id: a[0], Type: a[1], Name: a[2] };
  //     qlcID[a[0]] = a[1];
  //     // qlcType[a[0]] = (a[1]);
  //     return true;
  //   });

  React.useEffect(() => {
    if (!open) {
      setValue(valueProp)
    }
  }, [valueProp, open])

  const handleEntering = () => {
    if (radioGroupRef.current != null) {
      //   radioGroupRef.current.focus();
    }
  }

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    onClose(valueState)
    // console.log('QLCFormEventTest1', formData);
    const data = JSON.stringify(formData)
    // eslint-disable-next-line no-console
    console.error('QLCFormEventTest1', data)
    // dispatch(createQlcListener(props.integration.id, formData));
    createQlcListener(formData).then(() => {
      getIntegrations()
    })
    // if (typeof window !== 'undefined') window.location.href = window.location.href;
  }

  // const onModelChange = (key:any, val:any) => {
  //   utils.selectOrSet(key, model, val);
  // };
  // replaced with following code by reference from AddVirtualDialog Component.
  // const onModelChange = (config: any) => {
  //   setModel({ ...model, ...config });
  // };

  // const [f, setAge] = React.useState('');
  const handleEventChange = (event: any) => {
    // console.log('typetest', event.target);
    let { value } = event.target
    if (event.target.type === 'checkbox') {
      value = event.target.checked ? 255 : 0
      const qlcDatanewArr: any = qlcData.slice()
      qlcDatanewArr[0][event.target.name] = value
      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)
      const newSwitchState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }
      setSwitchValue(event.target.checked)
      setqlcData(qlcDatanewArr)
      // console.log('test', newSwitchState);
      setformData(newSwitchState)
    } else if (event.target.name === 'qlc_payload') {
      const qlcDatanewArr: any = qlcData.slice()
      const qlcDataObj: any = {
        [event.target.value[0]]: 0,
      }
      qlcDatanewArr[0] = qlcDataObj
      setSwitchValue(false)
      setqlcData(qlcDatanewArr)
      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)

      const newSwitchState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }
      // console.log('test', newSwitchState);
      setformData(newSwitchState)
    } else if (event.target.name === 'scene_name') {
      value = JSON.parse(value)
      const newFormState = {
        ...formData,
        event_filter: {
          ...formData.event_filter,
          [event.target.name]: value?.event_name,
        },
        event_type: value?.event_type,
      }
      setformData(newFormState)
    } else {
      // console.log("typetest",val);
      // console.log("typevalue",checkID);
      const qlcDatanewArr: any = qlcData.slice()
      //   qlcDatanewArr[0][checkID] = val;
      qlcDatanewArr[0][event.target.value[0]] = value
      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)
      const newSliderState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }
      setSliderValue(value)
      setformData(newSliderState)
    }

    // setformData(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleTypeChange = (event: any) => {
    // setButtonType(event.target.value.includes('Button') ? true : false);
    // setSliderType(event.target.value.includes('Slider') ? true : false);
    if (event.target.value.includes('Button')) {
      setButtonType(true)
    } else {
      setButtonType(false)
    }
    if (event.target.value.includes('Slider')) {
      setSliderType(true)
    } else {
      setSliderType(false)
    }
    setSwitchValue(false)
    setID(event.target.value[0])
    handleEventChange(event)
  }

  // work here next time to eliminate reference cloning probably make different handleswitchchange
  const handleDropTypeChange = (
    event: any,
    index: any,
    val: any,
    name: any
  ) => {
    // console.log("testing1",event.target.value);
    // console.log("testing",dropDownRenderList)
    const newArr: any = dropDownRenderList.slice()
    if (
      event.target.name === 'qlc_payload' &&
      event.target.value.includes('Button')
    ) {
      newArr[index].showSwitch = true
      newArr[index].showSlider = false
    } else if (
      event.target.name === 'qlc_payload' &&
      event.target.value.includes('Slider')
    ) {
      newArr[index].showSlider = true
      newArr[index].showSwitch = false
    }
    // if(event.target.name === "qlc_payload"){

    // }
    let { value: value1 } = event.target
    if (event.target.type === 'checkbox') {
      newArr[index].switchValue = event.target.checked
      // event.target.checked ? (value = 255) : (value = 0);
      value1 = event.target.checked ? 255 : 0
      const qlcDatanewArr: any = qlcData.slice()
      qlcDatanewArr[index + 1][event.target.name] = value1
      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)
      const newSwitchState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }

      setqlcData(qlcDatanewArr)
      setformData(newSwitchState)
    } else if (event.target.name === 'qlc_payload') {
      // newArr[index].value = event.target.value[0];
      const [target] = event.target.value
      newArr[index].value = target
      // console.log('test13', newArr);
      const qlcDatanewArr: any = qlcData.slice()
      const qlcDataObj = {
        [event.target.value[0]]: 0,
      }
      // console.log('test0', qlcDataObj);
      if (qlcDatanewArr[index + 1] === undefined) {
        qlcDatanewArr.push(qlcDataObj)
      } else {
        newArr[index].switchValue = false
        qlcDatanewArr[index + 1] = qlcDataObj
      }

      setqlcData(qlcDatanewArr)

      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)

      const newSwitchState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }
      // console.log('test', newSwitchState);
      setformData(newSwitchState)
    } else {
      const qlcDatanewArr: any = qlcData.slice()
      qlcDatanewArr[index + 1][name] = val
      const newqlcPayload = Object.assign({}, ...qlcDatanewArr)
      const newSliderState = {
        ...formData,
        qlc_payload: {
          ...newqlcPayload,
        },
      }

      setqlcData(qlcDatanewArr)
      setformData(newSliderState)
    }

    return setdropDownRenderList(newArr)
  }

  const handleTypeAddDropDown = () => {
    const newItem: any = {
      id: Date.now(),
      value: '',
      switchValue: false,
      showSwitch: false,
      showSlider: false,
    }

    const newArr: any = dropDownRenderList.slice()
    newArr.push(newItem)
    return setdropDownRenderList(newArr)
  }

  const handleTypeRemoveDropDown = (idx: any) => {
    const newArr = dropDownRenderList.slice()
    newArr.splice(idx, 1)
    const newQlcData = qlcData.slice()
    newQlcData.splice(idx + 1, 1)
    setqlcData(newQlcData)
    const newqlcPayload = Object.assign({}, ...newQlcData)
    const newSwitchState = {
      ...formData,
      qlc_payload: {
        ...newqlcPayload,
      },
    }
    // console.log('test', newSwitchState);
    setformData(newSwitchState)
    return setdropDownRenderList(newArr)
  }

  const marks = [
    { value: 1, label: '1' },
    { value: 255, label: '255' },
  ]

  delete other.deviceList

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      maxWidth="xs"
      onEntering={handleEntering}
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">
        Event Listener Setup: {valueProp?.id}
      </DialogTitle>
      <DialogContent dividers>
        <DialogContentText>
          To add a Event Listener to LedFx, please first select the type of
          event trigger (If This), and then provide the expected output (Then Do
          This).
        </DialogContentText>
        <FormControl className={classes.root}>
          <InputLabel htmlFor="grouped-select">
            Event Trigger (If This)
          </InputLabel>
          <Select
            id="grouped-select"
            defaultValue={formData?.event_filter?.scene_id}
            name="scene_name"
            onChange={handleEventChange}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <ListSubheader color="primary">Scene Set</ListSubheader>
            {SceneSet &&
              SceneSet.length > 0 &&
              SceneSet.map((val: any, idx: any) => (
                <MenuItem
                  key={idx}
                  value={JSON.stringify({
                    event_type: 'scene_activated',
                    event_name: val,
                  })}
                  //   name={val}
                >
                  <option>{val}</option>
                </MenuItem>
              ))}
            {/* We may want this at a later time.
                        <ListSubheader color="primary">
                            Effect Set
                        </ListSubheader>
                            {effectNames && effectNames.length > 1 && effectNames.map((val,idx)=>
                                <MenuItem
                                    key={idx}
                                    value={JSON.stringify({"event_type":"effect_set","event_name":val})}
                                    name={val}
                                >
                                    <option>
                                       {val}
                                    </option>
                                </MenuItem>)
                            }
                        <ListSubheader color="primary">
                            Effect Cleared
                        </ListSubheader>
                        <MenuItem><option>effect_cleared, effect_name: Effect Cleared</option></MenuItem> */}
          </Select>
        </FormControl>
        <FormHelperText>
          {' '}
          If you select an existing event trigger, then this will update/replace
          the existing `Then Do This`.
        </FormHelperText>
        <FormControl className={classes.root}>
          <InputLabel htmlFor="grouped-select">Then Do This</InputLabel>
          <Select
            labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            // value={formData.qlc_payload}
            name="qlc_payload"
            onChange={handleTypeChange}
            sx={{ minWidth: 250 }}
          >
            <MenuItem value="" />
            {QLCWidgets &&
              QLCWidgets.length > 0 &&
              QLCWidgets.map((e: any, f: any) => (
                <MenuItem
                  key={f}
                  value={e}
                  //  name={e[0]}
                >
                  <option>
                    ID: {e[0]}, Type: {e[1]}, Name: {e[2]}
                  </option>
                  {/* {Object.entries(qlcStuff)}
                            {QLCWidgets && QLCWidgets.length > 0 && QLCWidgets.map((e,f)=><MenuItem key={f} value="">
                            <option>{e}</option> */}
                </MenuItem>
              ))}
          </Select>

          {/*
                If {qlcType}  === 'Button' or 'Audio Triggers'
                return switch off (Value: 0) or on (Value: 255)
                If {qlcType}  === 'slider'
                return Slider
                Slider range: (0 to 255)
                    Else hide below buttons.
                */}
        </FormControl>

        {/*    For delete button using delete icon.
                    <Button aria-describedby={id} variant="contained" color="primary" onClick={() => { onDeleteVitem(listItem) }}>
                        <DeleteIcon />
                    </Button>
                    */}

        {/* <div style={{ minWidth: '150px' }}></div> */}
        <Root>
          {checkButtonType && (
            <label>QLC+ widget selected above (On/Off) </label>
          )}
          {checkButtonType && (
            <Switch
              color="primary"
              checked={switchValue}
              name={checkID || ''}
              onChange={handleEventChange}
            />
          )}
        </Root>

        <div style={{ minWidth: '150px' }}>
          {checkSliderType && <label>QLC Slider Widget Value</label>}
          {checkSliderType && (
            <Slider
              aria-labelledby="discrete-slider"
              valueLabelDisplay="auto"
              marks={marks}
              step={1}
              min={0}
              max={255}
              defaultValue={1}
              value={sliderValue}
              onChange={handleEventChange}
            />
          )}
        </div>
        {dropDownRenderList.map((item: any, idx) => (
          <ThisDropDown
            // key={idx}
            idx={idx}
            QLCWidgets={QLCWidgets}
            // id={item?.id}
            value={item?.value}
            switchValue={item?.switchValue}
            showSwitch={item?.showSwitch}
            showSlider={item?.showSlider}
            handleDropTypeChange={handleDropTypeChange}
            handleTypeRemoveDropDown={handleTypeRemoveDropDown}
          />
        ))}
        {/* If Below button pressed, then show additional 'Then do this' dropdown field. */}
        <Button
          variant="contained"
          color="primary"
          aria-label="Add"
          endIcon={<AddCircleIcon />}
          onClick={handleTypeAddDropDown}
          role="listitem"
        >
          ADD additional `then do this`
        </Button>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ConfirmationDialogRaw.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.string.isRequired,
}

export default function ConfirmationDialog({ integration }: any) {
  const [open, setOpen] = React.useState(false)

  const handleClickListItem = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Button
        variant="contained"
        color="primary"
        aria-label="Add"
        endIcon={<AddCircleIcon />}
        onClick={handleClickListItem}
        role="listitem"
      >
        ADD EVENT LISTENER
      </Button>

      <ConfirmationDialogRaw
        open={open}
        onClose={handleClose}
        value={integration}
      />
    </div>
  )
}
