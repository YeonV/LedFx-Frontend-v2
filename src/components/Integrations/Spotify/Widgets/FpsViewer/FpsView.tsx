import React, { CSSProperties, useEffect, useRef } from 'react'
import { useFps } from 'react-fps'

export interface FpsViewProps {
  width?: number
  height?: number
  top?: number | string
  left?: number | string
  bottom?: number | string
  right?: number | string
  lowFpsColor?: string
  color?: string
  wrapperStyle?: CSSProperties
  titleStyle?: CSSProperties
  graphStyle?: CSSProperties
  descriptionStyle?: CSSProperties
}

const FpsView: React.FC<FpsViewProps> = ({
  top = 'auto',
  left = 'auto',
  bottom = 'auto',
  right = 'auto',
  width = 240,
  height = 90,
  lowFpsColor = '#800000',
  color = '#0DBEDC',
  wrapperStyle = {},
  titleStyle = {},
  graphStyle = {},
  descriptionStyle = { color: '#aaa' }
}) => {
  const { fps, avgFps, maxFps, currentFps } = useFps(Math.floor(width / 2))
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        fps
          .slice()
          .reverse()
          .forEach((val, i) => {
            const barHeight = (height * val) / maxFps
            const barColor = val < maxFps * 0.8 ? lowFpsColor : color
            ctx.fillStyle = barColor
            ctx.fillRect(canvas.width - (i + 1) * 4, height - barHeight, 4, barHeight)
          })
      }
    }
  }, [fps, height, maxFps, lowFpsColor, color])

  const wrapperBaseStyle = {
    position: 'fixed',
    width: width + 6 + 'px',
    height: height + 30 + 'px',
    padding: '3px',
    backgroundColor: '#000000',
    color: '#FFFFFF',
    fontSize: '1rem',
    lineHeight: '1.3rem',
    border: '1px solid #333',
    top,
    right,
    bottom,
    left
  }
  return (
    <div style={{ ...(wrapperBaseStyle as CSSProperties), ...wrapperStyle }}>
      <span style={{ ...titleStyle }}>{currentFps} FPS</span>&nbsp;
      <span style={{ ...descriptionStyle }}>({avgFps} Avg)</span>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ display: 'block', marginTop: '5px', ...graphStyle }}
      />
    </div>
  )
}

export default FpsView
