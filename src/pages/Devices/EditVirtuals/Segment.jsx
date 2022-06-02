import { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import PixelSlider from './PixelSlider';
import PopoverSure from '../../../components/Popover/Popover';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import useStore from '../../../store/useStore';
import { swap } from '../../../utils/helpers';
import { useSegmentStyles } from './Segment.styles'

const Segment = ({ s, i, virtual, segments }) => {
    const getDevices = useStore((state) => state.getDevices);
    const devices = useStore((state) => state.devices);

    const title = devices && devices[Object.keys(devices).find(d => d === s[0])].config.name;
    const classes = useSegmentStyles();
    const updateVirtualSegments = useStore(state => state.updateVirtualSegments);
    const getVirtuals = useStore(state => state.getVirtuals);

    const handleInvert = () => {
        const newSegments = segments.map((seg, index) => index === i ? [seg[0], seg[1], seg[2], !seg[3]] : seg);
        updateVirtualSegments({ virtId: virtual.id, segments: newSegments }).then(() => getVirtuals());
    };
    const reorder = direction => {        
        const newSegments = direction === 'UP' ? swap(segments, i - 1, i) : swap(segments, i, i + 1);
        updateVirtualSegments({ virtId: virtual.id, segments: newSegments }).then(() => getVirtuals());
    };
    const handleDeleteSegment = () => {
        const newSegments = segments.filter((seg, index) => index !== i)
        updateVirtualSegments({ virtId: virtual.id, segments: newSegments }).then(() => getVirtuals());
    };
    const handleRangeSegment = (start, end) => {
        const newSegments = segments.map((seg, index) => index === i ? [seg[0], start, end, seg[3]] : seg);
        updateVirtualSegments({ virtId: virtual.id, segments: newSegments }).then(() => getVirtuals());
    };

    useEffect(() => {
        getDevices()
    }, [getDevices])

    return (
        <div style={{ padding: '0 1rem' }}>
            <div className={classes.segmentsWrapper}>
                <div className={classes.segmentsColOrder}>
                    <div style={{ display: 'flex' }}>
                        <div>
                            <Button
                                disabled={i === 0}
                                variant={'outlined'}
                                color={'inherit'}
                                onClick={() => reorder('UP')}
                                size={'small'}
                                className={classes.segmentsButtonUp}
                            >
                                <ExpandLess />
                            </Button>
                        </div>
                        <div>
                            <Button
                                disabled={i === virtual.segments.length - 1}
                                variant={'outlined'}
                                color={'inherit'}
                                onClick={() => reorder('DOWN')}
                                size={'small'}
                                className={classes.segmentsButtonDown}
                            >
                                <ExpandMore />
                            </Button>
                        </div>
                    </div>
                    <div style={{ minWidth: '120px' }}>
                        <Typography color="textSecondary">{title}</Typography>
                    </div>
                </div>
                <div className={classes.segmentsColPixelSlider}>
                    <PixelSlider s={s} handleRangeSegment={handleRangeSegment} />
                </div>
                <div className={classes.segmentsColActions}>
                    <div>
                        <Button
                            variant={s[3] ? 'contained' : 'outlined'}
                            color={s[3] ? 'primary' : 'default'}
                            endIcon={<SwapHorizIcon />}
                            onClick={handleInvert}
                            style={{ margin: '0 1rem 0 1.5rem' }}
                        >
                            Flip
                        </Button>
                    </div>
                    <PopoverSure
                        variant="outlined"
                        color="default"
                        onConfirm={handleDeleteSegment}
                        style={{ padding: '5px' }}
                    />
                </div>
            </div>
        </div>
    );
};

export default Segment;
