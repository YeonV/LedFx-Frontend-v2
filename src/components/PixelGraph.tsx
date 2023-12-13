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

  function hexColor(encodedString: string) {
    const binaryString = atob(encodedString.padEnd(4, '='))
    let pixelColor = 0
    for (let i = 0; i < binaryString.length; i += 1) {
      // eslint-disable-next-line no-bitwise
      pixelColor |= (binaryString.charCodeAt(i) << (8 * i))
    }
    const r = (pixelColor >> 16) & 0xFF
    const g = (pixelColor >> 8) & 0xFF
    const b = pixelColor & 0xFF
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }
  
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
      flexDirection: 'column-reverse',
      width: '100%',
      borderRadius: '10px 10px 0 0',
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
        {pixels && pixels.length > 0 && pixels.slice(row * pixels.length / rows, (row + 1) * pixels.length / rows).map((_p: any, i: number) => (
          <div
            key={i}
            style={{
              height: '38px',
              flex: 1,
              border: '1px solid black',
              margin: '2px',
              borderRadius: '5px',
              backgroundColor: active
                ? hexColor(pixels[row * pixels.length / rows + i])
                : '#0002',
            }}
          />
        ))}
      </div>
    ))}</div> : pixels && pixels.length ? (
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
      {pixels && pixels.length > 0 && pixels.map((_p: any, i: number) => (
        <div
          key={i}
          style={{
            height: '20px',
            flex: 1,
            borderRadius: '0',
            backgroundColor: active
              ? hexColor(pixels[i])
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
