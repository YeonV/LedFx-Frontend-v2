/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-bitwise */
/* eslint-disable prettier/prettier */
/* eslint-disable react/require-default-props */
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const PixelGraph = ({
  virtId,
  dummy = false,
  className = '',
  active = false,
  intGraphs = false,
  showMatrix = false,
}: {
  virtId: string;
  dummy?: boolean;
  className?: string;
  active?: boolean;
  intGraphs?: boolean;
  showMatrix?: boolean;
}) => {
  const [pixels, setPixels] = useState<any>([]);
  const pixelGraphs = useStore((state) => state.pixelGraphs);
  const virtuals = useStore((state) => state.virtuals);
  const devices = useStore((state) => state.devices);
  const graphs = useStore((state) => state.graphs);
  const rows = virtuals[virtId].is_device ? devices[virtuals[virtId].is_device]?.config?.rows || virtuals[virtId].config.rows || 1 : virtuals[virtId].config.rows || 1;
  const config = useStore((state) => state.config)

  function hexColor(encodedString: string) {
    if (config.transmission_mode === 'uncompressed' || !encodedString) {
      return []
    }
    const decodedString = atob(encodedString)
    const charCodes = Array.from(decodedString).map(char => char.charCodeAt(0))    
    const colors = []
    for (let i = 0; i < charCodes.length; i += 3) {
      const r = charCodes[i]
      const g = charCodes[i + 1]
      const b = charCodes[i + 2]
      colors.push({r, g, b})
    }    
    return colors
  }

  const decodedPixels = config.transmission_mode === 'compressed' ? pixels && pixels.length && hexColor(pixels) : pixels
  
  useEffect(() => {
    const handleWebsockets = (e: any) => {
      if (e.detail.id === virtId) {
        setPixels(e.detail.pixels);
      }
    };
    document.addEventListener('YZ', handleWebsockets);
    return () => {
      document.removeEventListener('YZ', handleWebsockets);
    };
  }, [virtuals, pixelGraphs]);

  if (!(graphs || intGraphs)) {
    return null;
  }

  return dummy ? (
    <div
      style={{
        maxWidth: '520px',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0',
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      <div
        key={1}
        style={{
          backgroundColor: '#0002',
          height: '20px',
          flex: 1,
          borderRadius: '0',
        }}
      />
    </div>
  ) : pixels && pixels.length && rows > 1 && showMatrix ? <div
    style={{
      maxWidth: '520px',
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      borderRadius: '10px',
      overflow: 'hidden',
      margin: '0.5rem 0 0 0',
    }}
    className={`${className}  ${active ? 'active' : ''}`}
  >{Array.from(Array(rows).keys()).map((row) => (
      <div
        key={`row-${row}`}
        style={{
          maxWidth: '520px',
          display: 'flex',
          width: '100%',
          borderRadius: '0',
          overflow: 'hidden',
          margin: '0',
        }}
        className={`${className}  ${active ? 'active' : ''}`}
      >
        { (config.transmission_mode === 'compressed'
          ? decodedPixels.slice(row * decodedPixels.length / rows, (row + 1) * decodedPixels.length / rows)
          : pixels[0].slice(row * pixels[0].length / rows, (row + 1) * pixels[0].length / rows))
          .map((_p: any, i: number) => (
            <div
              key={i}
              style={{
                height: ((config.transmission_mode === 'compressed' ? decodedPixels.length : pixels[0].length ) > 100) && rows > 9 
                  ? `min(min(${520 / ((config.transmission_mode === 'compressed' ? decodedPixels.length : pixels[0].length ) / rows)}px, ${520 /rows}px), 38px)`
                  : '38px',
                flex: 1,
                border: '1px solid black',
                margin: `${((config.transmission_mode === 'compressed' ? decodedPixels.length : pixels[0].length ) > 100) && rows > 9 ? 1 : 2}px`,
                borderRadius: ((config.transmission_mode === 'compressed' ? decodedPixels.length : pixels[0].length ) > 100) && rows > 9 ? '50%' : '5px',
                backgroundColor: active
                  ? config.transmission_mode === 'compressed'  ? `rgb(${Object.values(decodedPixels[row * decodedPixels.length / rows + i])})` : `rgb(${pixels[0][row * pixels[0].length / rows + i]},${pixels[1][row * pixels[0].length / rows + i]},${pixels[2][row * pixels[0].length / rows + i]})`
                  : '#0002',
              }}
            />
          ))}
      </div>
    ))}</div> : (pixels[0] || decodedPixels).length ? (
    <div
      style={{
        maxWidth: '520px',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0',
      }}
      className={`${className}  ${active ? 'active' : ''}`}
    >
      {(config.transmission_mode === 'compressed'
        ? decodedPixels
        : pixels[0]
      ).map((p: any, i: number) => (
        <div
          key={i}
          style={{
            height: '20px',
            flex: 1,
            borderRadius: '0',
            backgroundColor: active
              ? config.transmission_mode === 'compressed'  ? `rgb(${Object.values(p)})` : `rgb(${pixels[0][i]},${pixels[1][i]},${pixels[2][i]})`
              : '#0002',
          }}
        />
      ))}
    </div>
  ) : (
    <div
      style={{
        maxWidth: '520px',
        display: 'flex',
        width: '100%',
        borderRadius: '10px',
        overflow: 'hidden',
        margin: '0.5rem 0 0 0',
      }}
      className={`${className} ${active ? 'active' : ''}`}
    >
      <div
        key={1}
        style={{
          height: '20px',
          borderRadius: '0',
          flex: 1,
          backgroundColor: '#0002',
        }}
      />
    </div>
  );
};

export default PixelGraph;
