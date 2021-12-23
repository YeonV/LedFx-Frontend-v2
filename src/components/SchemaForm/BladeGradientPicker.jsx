import { useState, useCallback, useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import useClickOutside from '../../utils/useClickOutside';
import useStore from '../../utils/apiStore';
import ReactGPicker from "react-gcolor-picker";
import Popover from '../Popover';
import { TextField, Typography, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import { log } from '../../utils/helpers';
import DeleteColorsDialog from '../Dialogs/DeleteColors';
import { color } from '@mui/system';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    borderRadius: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '308px',
    overflow: 'auto',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '& .gradient-result': {
      display: 'none'
    },
    '& .input_rgba': {
      display: 'none'
    },
    '& .gradient-interaction': {
      order: -1,
      marginBottom: '1rem',
    },
    '& .colorpicker': {
      display: 'flex',
      flexDirection: 'column',
    },
    '& .color-picker-panel, & .popup_tabs-header, & .popup_tabs, & .colorpicker, & .colorpicker .color-picker-panel, & .popup_tabs-header .popup_tabs-header-label-active': {
      backgroundColor: 'transparent'
    },
    '& .popup_tabs-header-label-active': {
      color: theme.palette.text.primary
    },
    '& .popup_tabs-header-label': {
      color: theme.palette.text.disabled,
      '&.popup_tabs-header-label-active': {
        color: theme.palette.text.primary
      },
    },
    '& .popup_tabs-body': {
      paddingBottom: 4,
    },
  },
  addButton: {
    width: 69,
    height: 30,
    borderRadius: 4,
    border: '1px solid #999',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 24,
    margin: '0 auto',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#fff'
    }
  },
  picker: {
    height: '30px',
    margin: '15px 10px 10px 10px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid #fff',

  },
  wrapper: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    position: 'relative',
    width: '100%',
    margin: '0.5rem 0',
    '& > label': {
      top: '-0.5rem',
      display: 'flex',
      alignItems: 'center',
      left: '1rem',
      padding: '0 0.3rem',
      position: 'absolute',
      fontVariant: 'all-small-caps',
      fontSize: '0.9rem',
      letterSpacing: '0.1rem',
      backgroundColor: theme.palette.background.paper,
      boxSizing: 'border-box',
    },
  },
}));

// const coloring = {
//   red: 'rgb(255, 0, 0)',
//   'orange-deep': 'rgb(255, 40, 0)',
//   orange: 'rgb(255, 120, 0)',
//   yellow: 'rgb(255, 200, 0)',
//   'yellow-acid': 'rgb(160, 255, 0)',
//   green: 'rgb(0, 255, 0)',
//   'green-forest': 'rgb(34, 139, 34)',
//   'green-spring': 'rgb(0, 255, 127)',
//   'green-teal': 'rgb(0, 128, 128)',
//   'green-turquoise': 'rgb(0, 199, 140)',
//   'green-coral': 'rgb(0, 255, 50)',
//   cyan: 'rgb(0, 255, 255)',
//   blue: 'rgb(0, 0, 255)',
//   'blue-light': 'rgb(65, 105, 225)',
//   'blue-navy': 'rgb(0, 0, 128)',
//   'blue-aqua': 'rgb(0, 255, 255)',
//   purple: 'rgb(128, 0, 128)',
//   pink: 'rgb(255, 0, 178)',
//   magenta: 'rgb(255, 0, 255)',
//   black: 'rgb(0, 0, 0)',
//   white: 'rgb(255, 255, 255)',
//   gold: 'rgb(255, 215, 0)',
//   hotpink: 'rgb(255, 105, 180)',
//   lightblue: 'rgb(173, 216, 230)',
//   lightgreen: 'rgb(152, 251, 152)',
//   lightpink: 'rgb(255, 182, 193)',
//   lightyellow: 'rgb(255, 255, 224)',
//   maroon: 'rgb(128, 0, 0)',
//   mint: 'rgb(189, 252, 201)',
//   olive: 'rgb(85, 107, 47)',
//   peach: 'rgb(255, 100, 100)',
//   plum: 'rgb(221, 160, 221)',
//   sepia: 'rgb(94, 38, 18)',
//   skyblue: 'rgb(135, 206, 235)',
//   steelblue: 'rgb(70, 130, 180)',
//   tan: 'rgb(210, 180, 140)',
//   violetred: 'rgb(208, 32, 144)',
// };

// const gradients = {
//   "Rainbow": {
//     colors: [
//       coloring["red"],
//       coloring["orange"],
//       coloring["yellow"],
//       coloring["green"],
//       coloring["green-turquoise"],
//       coloring["blue"],
//       coloring["purple"],
//       coloring["pink"],
//     ]
//   },
//   "Dancefloor": {
//     colors: [
//       coloring["red"],
//       coloring["pink"],
//       coloring["blue"],
//     ]
//   },

//   "Plasma": {
//     colors: [
//       coloring["blue"],
//       coloring["purple"],
//       coloring["red"],
//       coloring["orange-deep"],
//       coloring["yellow"],
//     ]
//   },

//   "Ocean": {
//     colors: [
//       coloring["blue-aqua"],
//       coloring["blue"],
//     ]
//   },

//   "Viridis": {
//     colors: [
//       coloring["purple"],
//       coloring["blue"],
//       coloring["green-teal"],
//       coloring["green"],
//       coloring["yellow"],
//     ]
//   },

//   "Jungle": {
//     colors: [
//       coloring["green"],
//       coloring["green-forest"],
//       coloring["orange"],
//     ]
//   },

//   "Spring": {
//     colors: [
//       coloring["pink"],
//       coloring["orange-deep"],
//       coloring["yellow"],
//     ]
//   },

//   "Winter": {
//     colors: [
//       coloring["green-turquoise"],
//       coloring["green-coral"],
//     ]
//   },

//   "Frost": {
//     colors: [
//       coloring["blue"],
//       coloring["blue-aqua"],
//       coloring["purple"],
//       coloring["pink"],
//     ]
//   },

//   "Sunset": {
//     colors: [
//       coloring["blue-navy"],
//       coloring["orange"],
//       coloring["red"],
//     ]
//   },

//   "Borealis": {
//     colors: [
//       coloring["orange-deep"],

//       coloring["purple"],

//       coloring["green-turquoise"],

//       coloring["green"],
//     ]
//   },
//   "Rust": {
//     colors: [
//       coloring["orange-deep"],
//       coloring["red"],
//     ]
//   },
//   "Christmas": {
//     colors: [
//       coloring["red"],
//       coloring["red"],
//       coloring["red"],
//       coloring["red"],
//       coloring["red"],
//       coloring["green"],
//       coloring["green"],
//       coloring["green"],
//       coloring["green"],
//       coloring["green"],
//     ],
//     method: "repeat"
//   },
//   "Winamp": {
//     colors: [
//       coloring["green"],
//       coloring["yellow"],
//       coloring["orange"],
//       coloring["orange-deep"],
//       coloring["red"],
//     ]
//   },
// }


const BladeGradientPicker = ({ col, clr, index, virtual, gradient = false, wrapperStyle }) => {
  const classes = useStyles();
  const popover = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);
  const colors = useStore((state) => state.colors);
  const getColors = useStore((state) => state.getColors);
  const addColor = useStore((state) => state.addColor);
  // const gradients = useStore((state) => state.gradients);
  // const getGradients = useStore((state) => state.getGradients);
  // const addGradient = useStore((state) => state.addGradient);
  // console.log(colors)
  const test = {}
  if (colors.gradients && colors.colors) {
    Object.entries(colors.gradients.builtin).forEach(([k, g]) => { test[k] = g })
    Object.entries(colors.gradients.user).forEach(([k, g]) => { test[k] = g })
    Object.entries(colors.colors.builtin).forEach(([k, g]) => { test[k] = g })
    Object.entries(colors.colors.user).forEach(([k, g]) => { test[k] = g })
  }

  const virtuals = useStore((state) => state.virtuals);
  const effectyz = virtual && virtuals[Object.keys(virtuals).find((d) => d === virtual.id)];

  const sendColor = (e, v) => {
    if (virtual && effectyz && effectyz.effect && effectyz.effect.type) {
      updateVirtualEffect(virtual.id, {
        virtId: virtual.id,
        type: effectyz.effect.type,
        config: { [clr]: e },
      }).then(() => {
        getVirtuals();
      });
    }

  }
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  useClickOutside(popover, handleClose);

  const handleDeleteDialog = () => {
    setAnchorEl(null);
    setDialogOpen(true)
  }
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  const handleAddGradient = (e, v) => {
    addColor({ [name]: col }).then(() => {
      getColors();
    });
  }

  useEffect(() => {
    getColors();
  }, [])

  return (
    <div className={`${classes.wrapper} step-effect-${index} gradient-picker`} style={{ ...wrapperStyle }}>
      <label className={'MuiFormLabel-root'}>
        {clr.replaceAll('_', ' ').replaceAll('background', 'bg').replaceAll('name', '')}
      </label>
      <div
        className={classes.picker}
        style={{ background: col }}
        aria-describedby={id}
        onClick={handleClick}
      />

      <Popper
        id={id}
        open={open}
        onClose={handleClose}
        anchorEl={anchorEl}
        ref={popover}
      >
        <div className={`${classes.paper} gradient-picker`}>
          <>
            <ReactGPicker
              colorBoardHeight={150}
              debounce
              debounceMS={300}
              format="hex"
              gradient={gradient}
              solid={true}
              onChange={(c) => sendColor(c)}
              popupWidth={288}
              showAlpha={false}
              value={col}
              defaultColors={Object.values(test)}
            />
            <div style={{ marginTop: 2.5, width: '100%', display: 'flex', justifyContent: 'flex-end' }}>


              <Button 
              style={{
                width: 69,
                height: 30,
                borderRadius: 4,
                border: '1px solid #999',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                marginRight: 16,
                cursor: 'pointer'
              }} 
              variant={"outlined"} 
              onClick={() => handleDeleteDialog()}
              disabled={colors.length && colors.colors.length && colors.gradients.length && !(Object.keys(colors.colors.user).length > 0) && !Object.keys(colors.gradients.user).length > 0}
              >
                -
              </Button>
              <Popover
                className={classes.addButton}
                popoverStyle={{ padding: '0.5rem' }}
                color={"default"}
                variant="outlined"
                direction="center"
                content={<TextField
                  autoFocus
                  onClick={e => e.stopPropagation()}
                  onKeyDown={(e, v) => (e.key == 'Enter') && handleAddGradient(e, v)}
                  error={colors.length && colors.colors.length && colors.gradients.length && (Object.keys(colors.colors).indexOf(name) > -1 || Object.values(colors.colors).filter(p => p === col).length > 0 || Object.keys(colors.gradients).indexOf(name) > -1 || Object.values(colors.gradients).filter(p => p === col).length > 0)}
                  size="small"
                  variant="outlined"
                  id="gradientNameInput"
                  label={'Enter name to save as...'}
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                  }}
                />}
                confirmDisabled={name.length === 0}
                onConfirm={(e, v) => handleAddGradient(e, v)}
                startIcon={""}
                size="medium"
                icon={<Add />}
              />


            </div>
          </>
        </div>
      </Popper>
      <DeleteColorsDialog setDialogOpen={setDialogOpen} dialogOpen={dialogOpen} />
    </div>
  );
};
export default BladeGradientPicker;
