import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../utils/apiStore';

const useStyles = makeStyles((theme) => ({
  PixelWrapper: {
    maxWidth: '520px',
    display: 'flex',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '0.5rem 0 0 0',
    // border: '1px solid rgba(255, 255, 255, 0.3)',
    // '&.active': {
    //   border: '1px solid rgba(255, 0, 0, 0.3)',
    // },
    '@media (max-width: 580px)': {
      margin: '0',
    },
  },
  Pixel: {
    height: '20px',
    borderRadius: '0',
    flex: 1,
  }
}));

const PixelGraph = ({ virtId, dummy=false, className, active = false, intGraphs }) => {
  const classes = useStyles();
  const [pixels, setPixels] = useState([])
  const pixelGraphs = useStore((state) => state.pixelGraphs);
  const virtuals = useStore((state) => state.virtuals);
  const graphs = useStore((state) => state.graphs);

  useEffect(() => {
    const handleWebsockets = (e) => {
      if (e.detail.id === virtId) {
        setPixels(e.detail.pixels)
      }
    }
    document.addEventListener("YZ", handleWebsockets);
    return () => {
      document.removeEventListener("YZ", handleWebsockets)
    }
  }, [virtuals, pixelGraphs]);

  if (!(graphs || intGraphs)) {
    return null
  }

  return (
    dummy
      ? (<div className={`${classes.PixelWrapper} ${className} ${active ? 'active' : ''}`}>
        <div key={1} className={classes.Pixel} style={{ backgroundColor: '#0002' }} />
      </div>)
      : pixels && pixels[0] && pixels[0].length
        ? (<div className={`${classes.PixelWrapper} ${className}  ${active ? 'active' : ''}`}>
          {pixels[0].map((p, i) => (
            <div key={i} className={classes.Pixel} style={{ backgroundColor: active ? `rgb(${pixels[0][i]},${pixels[1][i]},${pixels[2][i]})` : '#0002' }} />
          ))}
        </div>
        )
        : (<div className={`${classes.PixelWrapper} ${className} ${active ? 'active' : ''}`}>
        <div key={1} className={classes.Pixel} style={{ backgroundColor: '#0002' }} />
      </div>)
  )
}

export default PixelGraph
