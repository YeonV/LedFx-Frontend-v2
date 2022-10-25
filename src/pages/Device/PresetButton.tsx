/* eslint-disable @typescript-eslint/indent */
import { useState } from 'react';
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from '@mui/material';
import { useLongPress } from 'use-long-press';
import { CloudOff, CloudUpload, CopyAll } from '@mui/icons-material';
import { makeStyles } from '@mui/styles';
import useStore from '../../store/useStore';
import Popover from '../../components/Popover/Popover';

const useStyles = makeStyles((theme) => ({
  bladeMenu: {
    '& .MuiPaper-root': {
      backgroundColor: theme.palette.grey[900],
    },
  },
}));

export default function PresetButton({
  delPreset,
  uploadPresetCloud,
  deletePresetCloud,
  label = 'Button',
  buttonColor,
  className,
  onClick,
}: any) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const open = Boolean(anchorEl);
  const isLogged = useStore((state) => state.isLogged);
  const features = useStore((state) => state.features);

  const longPress = useLongPress(
    (e) => {
      e.preventDefault();
      if (e.currentTarget) {
        setAnchorEl(e.currentTarget);
      } else {
        setAnchorEl(e.target);
      }
    },
    {
      onCancel: (e: any) => {
        if (e.button === 0) {
          onClick();
        }
      },
      threshold: 1000,
      captureEvent: true,
    }
  );

  return (
    <div>
      <Button
        aria-expanded={open ? 'true' : undefined}
        variant="outlined"
        color={buttonColor}
        className={className}
        {...longPress()}
        onContextMenu={(e) => {
          e.preventDefault();
          setAnchorEl(e.currentTarget || e.target);
        }}
      >
        {label}
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        className={classes.bladeMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <div>
          <Popover
            type="menuItem"
            variant="outlined"
            onConfirm={delPreset}
            label="Delete Preset"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
          />
        </div>
        <MenuItem
          onClick={(e) => {
            uploadPresetCloud(e);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <CopyAll fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy Preset</ListItemText>
        </MenuItem>
        {window.localStorage.getItem('ledfx-cloud-role') === 'creator' &&
          features.cloud &&
          isLogged && (
            <MenuItem
              onClick={(e) => {
                uploadPresetCloud(e);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <CloudUpload fontSize="small" />
              </ListItemIcon>
              <ListItemText>Upload to Cloud</ListItemText>
            </MenuItem>
          )}
        {window.localStorage.getItem('ledfx-cloud-role') === 'creator' &&
          features.cloud &&
          isLogged && (
            <MenuItem
              onClick={(e) => {
                deletePresetCloud(e);
                setAnchorEl(null);
              }}
            >
              <ListItemIcon>
                <CloudOff fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete from Cloud</ListItemText>
            </MenuItem>
          )}
      </Menu>
    </div>
  );
}
