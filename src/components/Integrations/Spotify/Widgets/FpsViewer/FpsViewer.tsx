import React, { CSSProperties } from 'react'
import FpsView from './FpsView'

interface FpsViewerProps {
  variant?: 'default' | 'dnd' | 'direct'
  open?: boolean
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

const FpsViewer: React.FC<FpsViewerProps> = ({
  variant = 'default',
  open = true,
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
  graphStyle = {}
}) => {
  if (!open) return null

  switch (variant) {
    case 'dnd':
      return (
        <FpsView
          top={top}
          left={left}
          bottom={bottom}
          right={right}
          width={width}
          height={height}
          lowFpsColor={lowFpsColor}
          color={color}
          wrapperStyle={wrapperStyle}
          titleStyle={titleStyle}
          graphStyle={graphStyle}
        />
      )
    case 'direct':
      return (
        <FpsView
          top={top}
          left={left}
          bottom={bottom}
          right={right}
          width={width}
          height={height}
          lowFpsColor={lowFpsColor}
          color={color}
          wrapperStyle={wrapperStyle}
          titleStyle={titleStyle}
        />
      )
    default:
      return (
        <FpsView
          top={top}
          left={left}
          bottom={bottom}
          right={right}
          width={width}
          height={height}
          lowFpsColor={lowFpsColor}
          color={color}
          wrapperStyle={wrapperStyle}
          titleStyle={titleStyle}
          graphStyle={graphStyle}
        />
      )
  }
}

export default FpsViewer
