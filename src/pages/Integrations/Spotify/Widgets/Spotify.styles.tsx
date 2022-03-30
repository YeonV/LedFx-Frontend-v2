/* eslint-disable no-unused-vars */
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

export const Widget = styled('div')(() => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(40px)',
}));

export const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
});

export const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
});

export const PosSliderStyles = {
  color: '#fff',
  height: 4,
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    width: 12,
    height: 12,
    transition: '0.3s cubic-bezier(.47,1.64,.41,.8)',
    '&:before': {
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.4)',
    },
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0px 0px 0px 8px rgb(255 255 255 / 16%)',
    },
    '&.Mui-active': {
      width: 20,
      height: 20,
    },
  },
  '& .MuiSlider-rail': {
    opacity: 0.28,
  },
};

export const VolSliderStyles = {
  color: '#fff',
  '& .MuiSlider-track': {
    border: 'none',
  },
  '& .MuiSlider-thumb': {
    width: 16,
    height: 16,
    backgroundColor: '#fff',
    '&:before': {
      boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
    },
    '&:hover, &.Mui-focusVisible, &.Mui-active': {
      boxShadow: 'none',
    },
  },
};
