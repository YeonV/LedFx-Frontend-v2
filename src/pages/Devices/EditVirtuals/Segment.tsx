import { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import PopoverSure from '../../../components/Popover/Popover';
import PixelSlider from './PixelSlider';
import useStore from '../../../store/useStore';
import { swap } from '../../../utils/helpers';
import useSegmentStyles from './Segment.styles';

const Segment = ({ s, i, virtual, segments }: any) => {
  const getDevices = useStore((state) => state.getDevices);
  const devices = useStore((state) => state.devices);
  const virtuals = useStore((state) => state.virtuals);

  const title =
    devices &&
    devices[devices && Object.keys(devices).find((d) => d === s[0])].config
      .name;
  const classes = useSegmentStyles();
  const updateVirtualSegments = useStore(
    (state) => state.updateVirtualSegments
  );
  const getVirtuals = useStore((state) => state.getVirtuals);
  const setVirtualEffect = useStore((state) => state.setVirtualEffect);

  const handleInvert = () => {
    const newSegments = segments.map((seg: any[], index: number) =>
      index === i ? [seg[0], seg[1], seg[2], !seg[3]] : seg
    );
    updateVirtualSegments(virtual.id, newSegments).then(() => getVirtuals());
  };
  const reorder = (direction: string) => {
    const newSegments =
      direction === 'UP' ? swap(segments, i - 1, i) : swap(segments, i, i + 1);
    updateVirtualSegments(virtual.id, newSegments).then(() => getVirtuals());
  };
  const handleDeleteSegment = () => {
    const newSegments = segments.filter(
      (_seg: any, index: number) => index !== i
    );
    updateVirtualSegments(virtual.id, newSegments).then(() => getVirtuals());
  };
  const handleRangeSegment = (start: number, end: number) => {
    const newSegments = segments.map((seg: any, index: number) =>
      index === i ? [seg[0], start, end, seg[3]] : seg
    );
    const deviceId = segments[i][0];
    const vd = Object.keys(virtuals).find(
      (v: any) => virtuals[v].is_device === deviceId
    );
    setVirtualEffect(virtual.id, 'singleColor', { color: '#000000' }, false);
    if (vd)
      setVirtualEffect(
        virtuals[vd].id,
        'singleColor',
        { color: '#000000' },
        false
      );
    updateVirtualSegments(virtual.id, newSegments).then(() =>
      getVirtuals().then(() =>
        setVirtualEffect(virtual.id, 'rainbow', { speed: 10 }, true)
      )
    );
  };

  useEffect(() => {
    getDevices();
  }, [getDevices]);

  return (
    <div style={{ padding: '0 1rem' }}>
      <div className={classes.segmentsWrapper}>
        <div className={classes.segmentsColOrder}>
          <div style={{ display: 'flex' }}>
            <div>
              <Button
                disabled={i === 0}
                color="inherit"
                onClick={() => reorder('UP')}
                size="small"
                className={classes.segmentsButtonUp}
              >
                <ExpandLess />
              </Button>
            </div>
            <div>
              <Button
                disabled={i === virtual.segments.length - 1}
                color="inherit"
                onClick={() => reorder('DOWN')}
                size="small"
                className={classes.segmentsButtonDown}
              >
                <ExpandMore />
              </Button>
            </div>
          </div>
          <div style={{ minWidth: '120px' }}>
            <Typography color="textSecondary">{title}</Typography>
            <Typography color="textSecondary">
              {s[1] === s[2] ? s[1] + 1 : `[ ${s[1] + 1} - ${s[2] + 1} ]`}
            </Typography>
          </div>
        </div>
        <div className={classes.segmentsColPixelSlider}>
          <PixelSlider s={s} handleRangeSegment={handleRangeSegment} />
        </div>
        <div className={classes.segmentsColActions}>
          <div>
            <Button
              variant={s[3] ? 'contained' : 'outlined'}
              color={s[3] ? 'primary' : 'inherit'}
              endIcon={<SwapHorizIcon />}
              onClick={handleInvert}
              style={{ margin: '0 1rem 0 1.5rem' }}
            >
              Flip
            </Button>
          </div>
          <PopoverSure
            variant="outlined"
            color="primary"
            onConfirm={handleDeleteSegment}
            style={{ padding: '5px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default Segment;
