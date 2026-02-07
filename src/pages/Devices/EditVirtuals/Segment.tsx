import { Typography, Button, Stack } from '@mui/material'
import { ExpandLess, ExpandMore, SwapHoriz } from '@mui/icons-material'
import { useCallback, useMemo } from 'react'
import { swap } from '../../../utils/helpers'
import PopoverSure from '../../../components/Popover/Popover'
import PixelSlider from './PixelSlider'
import useStore from '../../../store/useStore'
import useSegmentStyles from './Segment.styles'

const Segment = ({ s, i, virtual, segments, calib }: any) => {
  const devices = useStore((state) => state.devices)
  const virtuals = useStore((state) => state.virtuals)
  const updateSegments = useStore((state) => state.updateSegments)
  const highlightSegment = useStore((state) => state.highlightSegment)
  const highlightOffSegment = useStore((state) => state.highlightOffSegment)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const activeSegment = useStore((state) => state.activeSegment)
  const setActiveSegment = useStore((state) => state.setActiveSegment)

  const title = useMemo(() => {
    if (!devices || !virtuals) return ''
    const deviceKey = Object.keys(devices).find((d) => d === s[0])
    return deviceKey ? virtuals[deviceKey]?.config?.name : ''
  }, [devices, virtuals, s])

  const classes = useSegmentStyles()

  const handleInvert = useCallback(() => {
    const newSegments = segments.map((seg: any[], index: number) =>
      index === i ? [seg[0], seg[1], seg[2], !seg[3]] : seg
    )
    updateSegments(virtual.id, newSegments).then(() => {
      getVirtuals()
      if (calib) {
        highlightSegment(
          virtual.id,
          newSegments[i][0],
          newSegments[i][1],
          newSegments[i][2],
          newSegments[i][3]
        )
        setActiveSegment(i)
      }
    })
  }, [
    segments,
    i,
    virtual.id,
    updateSegments,
    getVirtuals,
    calib,
    highlightSegment,
    setActiveSegment
  ])

  const reorder = useCallback(
    (direction: string) => {
      const newSegments = direction === 'UP' ? swap(segments, i - 1, i) : swap(segments, i, i + 1)
      updateSegments(virtual.id, newSegments).then(() => {
        getVirtuals()
        if (calib) {
          highlightSegment(
            virtual.id,
            newSegments[direction === 'UP' ? i - 1 : i + 1][0],
            newSegments[direction === 'UP' ? i - 1 : i + 1][1],
            newSegments[direction === 'UP' ? i - 1 : i + 1][2],
            newSegments[direction === 'UP' ? i - 1 : i + 1][3]
          )
          setActiveSegment(direction === 'UP' ? i - 1 : i + 1)
        }
      })
    },
    [
      segments,
      i,
      virtual.id,
      updateSegments,
      getVirtuals,
      calib,
      highlightSegment,
      setActiveSegment
    ]
  )

  const handleDeleteSegment = useCallback(() => {
    const newSegments = segments.filter((_seg: any, index: number) => index !== i)
    updateSegments(virtual.id, newSegments).then(() => {
      getVirtuals()
      if (calib) {
        highlightOffSegment(virtual.id)
        setActiveSegment(-1)
      }
    })
  }, [
    segments,
    i,
    virtual.id,
    updateSegments,
    getVirtuals,
    calib,
    highlightOffSegment,
    setActiveSegment
  ])

  const handleRangeSegment = useCallback(
    (start: number, end: number) => {
      const newSegments = segments.map((seg: any, index: number) =>
        index === i ? [seg[0], start, end, seg[3]] : seg
      )

      updateSegments(virtual.id, newSegments).then(() => {
        getVirtuals()
        if (calib) {
          highlightSegment(
            virtual.id,
            newSegments[i][0],
            newSegments[i][1],
            newSegments[i][2],
            newSegments[i][3]
          )
          setActiveSegment(i)
        }
      })
    },
    [
      segments,
      i,
      virtual.id,
      updateSegments,
      getVirtuals,
      calib,
      highlightSegment,
      setActiveSegment
    ]
  )

  const containerStyle = useMemo(
    () => ({
      padding: '0 1rem',
      background: calib && i === activeSegment ? '#ffffff18' : ''
    }),
    [calib, i, activeSegment]
  )

  const pixelSliderContainerStyle = useMemo(
    () => ({
      alignSelf: 'stretch' as const,
      display: 'flex',
      flexDirection: 'column' as const
    }),
    []
  )

  const flipButtonStyle = useMemo(() => ({ margin: '0 1rem 0 1.5rem' }), [])
  const popoverStyle = useMemo(() => ({ padding: '5px' }), [])
  const flexContainerStyle = useMemo(() => ({ display: 'flex' }), [])

  return (
    <div style={containerStyle}>
      <div className={classes.segmentsWrapper}>
        <Stack direction="column" spacing={1} alignItems="flex-start">
          <Typography color="textSecondary" marginTop={1} marginBottom={-1}>
            {title}
          </Typography>
          <div className={classes.segmentsColOrder}>
            <div style={flexContainerStyle}>
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
          </div>
        </Stack>
        <div className={classes.segmentsColPixelSlider} style={pixelSliderContainerStyle}>
          <PixelSlider s={s} handleRangeSegment={handleRangeSegment} />
        </div>
        <div className={classes.segmentsColActions}>
          <div>
            <Button
              variant={s[3] ? 'contained' : 'outlined'}
              color={s[3] ? 'primary' : 'inherit'}
              endIcon={<SwapHoriz />}
              onClick={handleInvert}
              style={flipButtonStyle}
            >
              Flip
            </Button>
          </div>
          <PopoverSure
            variant="outlined"
            color="primary"
            onConfirm={handleDeleteSegment}
            style={popoverStyle}
          />
        </div>
      </div>
    </div>
  )
}

export default Segment
