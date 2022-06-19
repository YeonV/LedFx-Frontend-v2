import { useState, useRef, useEffect } from 'react';
import Popper from '@material-ui/core/Popper';
import ReactGPicker from 'react-gcolor-picker';
import { TextField, Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import useClickOutside from '../../../../utils/useClickOutside';
import Popover from '../../../Popover/Popover';
import DeleteColorsDialog from '../../../Dialogs/DeleteColors';
import useStyles from './GradientPicker.styles';
import {
  GradientPickerDefaultProps,
  GradientPickerProps,
} from './GradientPicker.props';

const GradientPicker = ({
  pickerBgColor,
  title,
  index,
  isGradient = false,
  wrapperStyle,
  colors,
  handleAddGradient,
  sendColorToVirtuals,
}: GradientPickerProps) => {
  const classes = useStyles();
  const popover = useRef(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [pickerBgColorInt, setPickerBgColorInt] = useState(pickerBgColor);
  const [colorExists, setColorExists] = useState(false);

  const defaultColors: any = {};
  if (colors && colors.gradients && colors.colors) {
    Object.entries(colors.gradients.builtin).forEach(([k, g]) => {
      defaultColors[k] = g;
    });
    Object.entries(colors.gradients.user).forEach(([k, g]) => {
      defaultColors[k] = g;
    });
    Object.entries(colors.colors.builtin).forEach(([k, g]) => {
      defaultColors[k] = g;
    });
    Object.entries(colors.colors.user).forEach(([k, g]) => {
      defaultColors[k] = g;
    });
  }

  const handleClick = (event: any) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const checkForConsistingColor = (newName: string) => {
    return !!(
      colors?.colors?.user &&
      colors.colors.builtin &&
      colors.gradients?.user &&
      colors.gradients.builtin &&
      (Object.keys(colors.colors.user).indexOf(newName) > -1 ||
        Object.keys(colors.colors.builtin).indexOf(newName) > -1 ||
        Object.keys(colors.gradients.user).indexOf(newName) > -1 ||
        Object.keys(colors.gradients.builtin).indexOf(newName) > -1)
    );
  };

  useClickOutside(popover, handleClose);

  const handleDeleteDialog = () => {
    setAnchorEl(null);
    setDialogOpen(true);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popper' : undefined;

  useEffect(() => {
    setPickerBgColorInt(pickerBgColor);
  }, [pickerBgColor, setPickerBgColorInt]);

  return (
    <div
      className={`${classes.wrapper} step-effect-${index} gradient-picker`}
      style={{ ...wrapperStyle }}
    >
      <label className="MuiFormLabel-root">
        {title &&
          title
            .replaceAll('_', ' ')
            .replaceAll('background', 'bg')
            .replaceAll('name', '')}
      </label>
      {/* eslint-disable-next-line */}
      <div
        className={classes.picker}
        style={{ background: pickerBgColorInt }}
        aria-describedby={id}
        onClick={handleClick}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} ref={popover && popover}>
        <div className={`${classes.paper} gradient-picker`}>
          <ReactGPicker
            colorBoardHeight={150}
            debounce
            debounceMS={300}
            format="hex"
            gradient={isGradient}
            solid
            onChange={(c) => {
              setPickerBgColorInt(c);
              return sendColorToVirtuals(c);
            }}
            popupWidth={288}
            showAlpha={false}
            value={pickerBgColorInt}
            defaultColors={Object.values(defaultColors)}
          />
          <div
            style={{
              marginTop: 2.5,
              width: '100%',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
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
                cursor: 'pointer',
              }}
              variant="outlined"
              onClick={() => handleDeleteDialog()}
              disabled={
                colors &&
                colors.colors?.user &&
                colors.gradients?.user &&
                !(Object.keys(colors.colors.user)?.length > 0) &&
                !(Object.keys(colors.gradients.user)?.length > 0)
              }
            >
              -
            </Button>
            <Popover
              className={classes.addButton}
              popoverStyle={{ padding: '0.5rem' }}
              color="default"
              variant="outlined"
              content={
                <TextField
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e: any) =>
                    e.key === 'Enter' && handleAddGradient(name)
                  }
                  error={colorExists}
                  size="small"
                  variant="outlined"
                  id="gradientNameInput"
                  label="Enter name to save as..."
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setColorExists(checkForConsistingColor(e.target.value));
                  }}
                />
              }
              confirmDisabled={colorExists || name.length === 0}
              onConfirm={() => handleAddGradient(name)}
              startIcon=""
              size="medium"
              icon={<Add />}
            />
          </div>
        </div>
      </Popper>
      <DeleteColorsDialog
        setDialogOpen={setDialogOpen}
        dialogOpen={dialogOpen}
      />
    </div>
  );
};

GradientPicker.defaultProps = GradientPickerDefaultProps;

export default GradientPicker;
