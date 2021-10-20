import { useState, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import useClickOutside from '../../utils/useClickOutside';
import useStore from '../../utils/apiStore';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    borderRadius: 10,
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '320px',
    height: '50vh',
    overflow: 'auto',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    '&.gradient-picker': {
      // backgroundColor: 'blue'
    }
  },
  picker: {
    // width: '135px',
    height: '30px',
    margin: '15px 10px 10px 10px',
    borderRadius: '10px',
    cursor: 'pointer',
    border: '1px solid #fff',
    "@media (max-width: 580px)": {
      // width: "31vw",
    },
  },
  pickerItemWrapper: {
    width: 300,
    cursor: 'pointer',
    padding: '2px 3px 2px 15px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    border: '1px solid #999',
    margin: 3,
    transition: 'background-color 0.15s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',     
    },
    '.gradient-picker-var2 &': {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      padding: 0
    }
  },
  pickerItemGradient: {
    width: 200,
    height: 20,
    borderRadius: 7,
    '.gradient-picker-var2 &': {
      width: '100%',
      height: 30,
      borderRadius: 10
    }
  },
  pickerItemLabel: {
    '.gradient-picker-var2 &': {
      position: 'absolute',
      background: 'rgba(0,0,0,0.5)',
      padding: '0px 15px',
      borderRadius: 10,
      fontSize: 12
    },
  },
  wrapper: {
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    position: 'relative',
    // margin: "0.5rem",
    order: '-2',
    // "@media (max-width: 580px)": {
    width: '100%',
    margin: '0.5rem 0',
    // },
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

const coloring = {
  red: 'rgb(255, 0, 0)',
  'orange-deep': 'rgb(255, 40, 0)',
  orange: 'rgb(255, 120, 0)',
  yellow: 'rgb(255, 200, 0)',
  'yellow-acid': 'rgb(160, 255, 0)',
  green: 'rgb(0, 255, 0)',
  'green-forest': 'rgb(34, 139, 34)',
  'green-spring': 'rgb(0, 255, 127)',
  'green-teal': 'rgb(0, 128, 128)',
  'green-turquoise': 'rgb(0, 199, 140)',
  'green-coral': 'rgb(0, 255, 50)',
  cyan: 'rgb(0, 255, 255)',
  blue: 'rgb(0, 0, 255)',
  'blue-light': 'rgb(65, 105, 225)',
  'blue-navy': 'rgb(0, 0, 128)',
  'blue-aqua': 'rgb(0, 255, 255)',
  purple: 'rgb(128, 0, 128)',
  pink: 'rgb(255, 0, 178)',
  magenta: 'rgb(255, 0, 255)',
  black: 'rgb(0, 0, 0)',
  white: 'rgb(255, 255, 255)',
  gold: 'rgb(255, 215, 0)',
  hotpink: 'rgb(255, 105, 180)',
  lightblue: 'rgb(173, 216, 230)',
  lightgreen: 'rgb(152, 251, 152)',
  lightpink: 'rgb(255, 182, 193)',
  lightyellow: 'rgb(255, 255, 224)',
  maroon: 'rgb(128, 0, 0)',
  mint: 'rgb(189, 252, 201)',
  olive: 'rgb(85, 107, 47)',
  peach: 'rgb(255, 100, 100)',
  plum: 'rgb(221, 160, 221)',
  sepia: 'rgb(94, 38, 18)',
  skyblue: 'rgb(135, 206, 235)',
  steelblue: 'rgb(70, 130, 180)',
  tan: 'rgb(210, 180, 140)',
  violetred: 'rgb(208, 32, 144)',
};

const gradients = {
  "Rainbow": {
    colors: [
      coloring["red"],
      coloring["orange"],
      coloring["yellow"],
      coloring["green"],
      coloring["green-turquoise"],
      coloring["blue"],
      coloring["purple"],
      coloring["pink"],
    ]
  },
  "Dancefloor": {
    colors: [
      coloring["red"],
      coloring["pink"],
      coloring["blue"],
    ]
  },

  "Plasma": {
    colors: [
      coloring["blue"],
      coloring["purple"],
      coloring["red"],
      coloring["orange-deep"],
      coloring["yellow"],
    ]
  },

  "Ocean": {
    colors: [
      coloring["blue-aqua"],
      coloring["blue"],
    ]
  },

  "Viridis": {
    colors: [
      coloring["purple"],
      coloring["blue"],
      coloring["green-teal"],
      coloring["green"],
      coloring["yellow"],
    ]
  },

  "Jungle": {
    colors: [
      coloring["green"],
      coloring["green-forest"],
      coloring["orange"],
    ]
  },

  "Spring": {
    colors: [
      coloring["pink"],
      coloring["orange-deep"],
      coloring["yellow"],
    ]
  },

  "Winter": {
    colors: [
      coloring["green-turquoise"],
      coloring["green-coral"],
    ]
  },

  "Frost": {
    colors: [
      coloring["blue"],
      coloring["blue-aqua"],
      coloring["purple"],
      coloring["pink"],
    ]
  },

  "Sunset": {
    colors: [
      coloring["blue-navy"],
      coloring["orange"],
      coloring["red"],
    ]
  },

  "Borealis": {
    colors: [
      coloring["orange-deep"],

      coloring["purple"],

      coloring["green-turquoise"],

      coloring["green"],
    ]
  },
  "Rust": {
    colors: [
      coloring["orange-deep"],
      coloring["red"],
    ]
  },
  "Christmas": {
    colors: [
      coloring["red"],
      coloring["red"],
      coloring["red"],
      coloring["red"],
      coloring["red"],
      coloring["green"],
      coloring["green"],
      coloring["green"],
      coloring["green"],
      coloring["green"],
    ],
    method: "repeat"
  },
  "Winamp": {
    colors: [
      coloring["green"],
      coloring["yellow"],
      coloring["orange"],
      coloring["orange-deep"],
      coloring["red"],
    ]
  },
}


const BladeGradientPicker = ({ col, clr, index, virtual, variant = 'picker' }) => {
  const classes = useStyles();
  const popover = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const updateVirtualEffect = useStore((state) => state.updateVirtualEffect);
  const getVirtuals = useStore((state) => state.getVirtuals);

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
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div className={`${classes.wrapper} step-effect-${index} gradient-${variant}`} style={{ width: '49%', display: virtual.effect.config.solid_color ? 'none' : 'block' }}>
      <label className={'MuiFormLabel-root'}>
        {/* <Palette /> */}
        {clr.replaceAll('_', ' ').replaceAll('background', 'bg').replaceAll('name', '')}
      </label>
      <div
        className={classes.picker}
        style={{
          background: coloring[col],
          background: `linear-gradient(to right,${Object.keys(gradients).indexOf(col) > -1 ? (gradients[col].colors.map((c, i) => i === 0 ? `${c}, ` : `${c} ${i * 100 / (gradients[col].colors.length - 1)}%${i === gradients[col].colors.length - 1 ? '' : ', '}`).join('')) : '#000, #fff 100%'})`
        }}
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
        <div className={`${classes.paper} gradient-${variant}`}>

          {Object.keys(gradients).map((cg) => (
            <div
              key={cg}
              className={classes.pickerItemWrapper}
              onClick={() => sendColor(cg)}
            >
              <div className={classes.pickerItemLabel}>
                {cg}
              </div>
              <div className={classes.pickerItemGradient} style={{ background: `linear-gradient(to right,${gradients[cg].colors.map((c, i) => i === 0 ? `${c}, ` : `${c} ${i * 100 / (gradients[cg].colors.length - 1)}%${i === gradients[cg].colors.length - 1 ? '' : ', '}`).join('')})` }} />
            </div>
          ))}
        </div>
      </Popper>
    </div>
  );
};
export default BladeGradientPicker;
