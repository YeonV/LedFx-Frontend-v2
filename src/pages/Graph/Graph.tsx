/* eslint-disable @typescript-eslint/indent */

import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import { useParams } from 'react-router-dom'
import useStore from '../../store/useStore'
import PixelGraph from '../../components/PixelGraph'
import { Virtual } from '../../store/api/storeVirtuals'

const Graph = () => {
  const fade = false
  const { virtId } = useParams()
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getSchemas = useStore((state) => state.getSchemas)
  const virtuals = useStore((state) => state.virtuals)
  const effects = useStore((state) => state.schemas.effects)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const [virtual, setVirtual] = useState<Virtual | undefined>(undefined)

  const graphs = useStore((state) => state.graphs)
  const getV = () => {
    for (const prop in virtuals) {
      if (virtuals[prop].id === virtId) {
        return virtuals[prop]
      }
    }
  }

  useEffect(() => {
    const v = getV()
    if (v) setVirtual(v)
  }, [virtId])

  const effectType = virtual && virtual.effect.type

  useEffect(() => {
    getVirtuals()
    getSchemas()
    if (graphs && virtId) {
      setPixelGraphs([virtId])
    }
  }, [graphs, setPixelGraphs, getVirtuals, getSchemas, effectType])

  // console.log('virtual', virtual?.effect?.config)
  return (
    <Box
      sx={
        fade
          ? {
              opacity: 0.2,
              transition: 'opacity',
              transitionDuration: '1000'
            }
          : {
              opacity: 1,
              transitionDuration: '0'
            }
      }
      style={{
        transitionDuration: `${(virtual?.config?.transition_time || 1) * 1000}`
      }}
    >
      {virtId && (
        <PixelGraph
          showMatrix
          fullScreen
          virtId={virtId}
          active={
            virtuals &&
            virtual &&
            effects &&
            virtual.effect &&
            virtual.effect.config
          }
          dummy={
            !(
              virtuals &&
              virtual &&
              effects &&
              virtual.effect &&
              virtual.effect.config
            )
          }
        />
      )}
    </Box>
  )
}

export default Graph
