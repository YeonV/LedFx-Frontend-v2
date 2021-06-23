import { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import useStore from '../../utils/apiStore';

const useStyles = makeStyles((theme) => ({
  PixelWrapper: {
    maxWidth: '520px',
    display: 'flex',
    width: '100%',
    borderRadius: '10px',
    overflow: 'hidden',
    margin: '1rem 0 0 0',
    '@media (max-width: 580px)': {
      margin: '0',
    },
    border: '1px solid',
    borderColor: theme.palette.text.secondary,
  },
  Pixel: { 
    height: '40px',
    width: '20px',
    borderRadius: '0',
    flex: 1,
  }
}));

const PixelGraph = ({ virtId }) => {

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

  if (!graphs) {
    return null
  }
  
  return (
    pixels && pixels[0] && pixels[0].length
      ? (<div className={classes.PixelWrapper}>
        {pixels[0].map((p, i) => (
          <div key={i} className={classes.Pixel} style={{ backgroundColor: `rgb(${pixels[0][i]},${pixels[1][i]},${pixels[2][i]})` }} />
        ))}
      </div>
      )
      : (<></>)
  )
}

export default PixelGraph
