import { useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import PixelSlider from './PixelSlider';
import PopoverSure from '../../components/Popover';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import useStore from '../../utils/apiStore';
import { swap } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
    segmentsWrapper: {
        display: 'flex',
        borderBottom: '1px dashed #aaa',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
    },
    segmentsColOrder: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    segmentsButtonUp: {
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        minWidth: '50px',
    },
    segmentsButtonDown: {
        borderTopLeftRadius: 0,
        borderBottomLeftRadius: 0,
        minWidth: '50px',
        marginRight: '1rem',
    },
    segmentsColPixelSlider: {
        flex: '0 1 70%',
    },
    segmentsColActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    '@media (max-width: 600px)': {
        segmentsColPixelSlider: {
            order: 3,
            width: 'calc(100% - 2rem)',
            margin: '2rem auto 0 auto',
        },

        segmentsWrapper: {
            flexDirection: 'column',
            alignItems: 'flex-start',
        },
        segmentsColActions: {
            position: 'absolute',
            right: '1rem',
        },
    },
}));

const Segment = ({ s, i, display, segments }) => {
    const getDevices = useStore((state) => state.getDevices);
    const devices = useStore((state) => state.devices);

    const title = devices && devices[Object.keys(devices).find(d => d === s[0])].config.name;
    const classes = useStyles();
    const updateDisplaySegments = useStore(state => state.updateDisplaySegments);
    const getDisplays = useStore(state => state.getDisplays);

    const handleInvert = () => {
        const newSegments = segments.map((seg, index) => index === i ? [seg[0], seg[1], seg[2], !seg[3]] : seg);
        updateDisplaySegments({ displayId: display.id, segments: newSegments }).then(() => getDisplays());
    };
    const reorder = direction => {
        const newSegments = direction === 'UP' ? swap(segments, i - 1, i) : swap(segments, i, i + 1);
        updateDisplaySegments({ displayId: display.id, segments: newSegments }).then(() => getDisplays());
    };
    const handleDeleteSegment = () => {
        const newSegments = segments.filter((seg, index) => index !== i)
        updateDisplaySegments({ displayId: display.id, segments: newSegments }).then(() => getDisplays());
    };
    const handleRangeSegment = (start, end) => {
        const newSegments = segments.map((seg, index) => index === i ? [seg[0], start, end, !seg[3]] : seg);
        updateDisplaySegments({ displayId: display.id, segments: newSegments }).then(() => getDisplays());
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
                                disabled={i === display.segments.length - 1}
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
                    <PixelSlider s={s} i={i} display={display} handleRangeSegment={handleRangeSegment} />
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
