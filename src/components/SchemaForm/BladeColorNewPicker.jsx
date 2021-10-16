import { useState, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { HslStringColorPicker } from 'react-colorful';
import useClickOutside from '../../utils/useClickOutside';

const useStyles = makeStyles((theme) => ({
  paper: {
    border: '1px solid',
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '320px',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  picker: {
    width: '150px',
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
    margin: '0.5rem',
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

const BladeColorNewPicker = ({ sendColor, col, clr, virtual }) => {
  const classes = useStyles();
  const popover = useRef();
  const [anchorEl, setAnchorEl] = useState(null);
  const [colorNew, setColorNew] = useState('hsl(0, 100%, 25%)');
  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };
  const handleColorChange = (e) => {
    console.log(virtual)
    setColorNew(e);
    sendColor(e, virtual);
  };
  // const handleClickaway = event => {
  //     console.log(anchorEl);
  //     if (!anchorEl) {
  //         setAnchorEl(null);
  //     }
  //     // setAnchorEl(anchorEl ? null : event.currentTarget);
  // };
  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);
  useClickOutside(popover, handleClose);
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  return (
    <div className={classes.wrapper}>
      <label className={'MuiFormLabel-root'}>
        {/* <Palette /> */}
        {clr.replaceAll('_', ' ')}
      </label>
      <div
        className={classes.picker}
        style={{
          backgroundColor: colorNew.replaceAll('"', '').replaceAll("'", ''),
        }}
        aria-describedby={id}
        onClick={handleClick}
      />
      <ClickAwayListener
        onClickAway={() => {
          // console.log('anchorEl');
          // setAnchorEl(null);
        }}
      >
        <Popper
          id={id}
          open={open}
          onClose={handleClose}
          anchorEl={anchorEl}
          ref={popover}
        >
          <div className={classes.paper}>
            <HslStringColorPicker
              color={colorNew}
              onChange={(e)=>handleColorChange(e)}
            />
            {/* {Object.keys(coloring).map(c => (
                            <div
                                key={c}
                                style={{
                                    width: c === col ? '22px' : '20px',
                                    height: c === col ? '22px' : '20px',
                                    margin: c === col ? '4px' : '5px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    background: coloring[c],
                                    border: c === col ? `2px solid #000` : `1px solid #fff`,
                                }}
                                onClick={() => sendColor(c)}
                            ></div>
                        ))} */}
          </div>
        </Popper>
      </ClickAwayListener>
    </div>
  );
};
export default BladeColorNewPicker;
