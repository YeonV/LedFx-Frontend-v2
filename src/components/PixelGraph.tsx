/* eslint-disable react/require-default-props */
import { useEffect, useState } from 'react';
import useStore from '../store/useStore';

const PixelGraph = ({
  virtId,
  dummy = false,
  className = '',
  active = false,
  intGraphs = false,
}: {
  virtId: string;
  dummy?: boolean;
  className?: string;
  active?: boolean;
  intGraphs?: boolean;
}) => {
  const [pixels, setPixels] = useState<any>([]);
  const pixelGraphs = useStore((state) => state.pixelGraphs);
  const virtuals = useStore((state) => state.virtuals);
  const graphs = useStore((state) => state.graphs);

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
  ) : pixels && pixels[0] && pixels[0].length ? (
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
      {pixels[0].map((_p: any, i: number) => (
        <div
          key={i}
          style={{
            height: '20px',
            flex: 1,
            borderRadius: '0',
            backgroundColor: active
              ? `rgb(${pixels[0][i]},${pixels[1][i]},${pixels[2][i]})`
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
