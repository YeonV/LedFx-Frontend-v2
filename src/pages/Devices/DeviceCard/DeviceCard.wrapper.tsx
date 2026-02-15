/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react'
import useStore from '../../../store/useStore'
import DeviceCard from './DeviceCard'
import { IVirtualOrder } from '../../../store/api/storeVirtuals'
import { Button, Popover } from '@mui/material'
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material'

const DeviceCardWrapper = ({ virtual, index }: { virtual: any; index: number }) => {
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const schemas = useStore((state) => state.schemas)
  const virtuals = useStore((state) => state.virtuals)
  const devices = useStore((state) => state.devices)
  const deleteVirtual = useStore((state) => state.deleteVirtual)
  const setDialogOpenAddDevice = useStore((state) => state.setDialogOpenAddDevice)
  const setDialogOpenAddVirtual = useStore((state) => state.setDialogOpenAddVirtual)
  const graphs = useStore((state) => state.graphs)
  const virtualOrder = useStore((state) => state.virtualOrder)
  const setVirtualOrder = useStore((state) => state.setVirtualOrder)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const removeEffectfromHistory = useStore((state) => state.removeEffectfromHistory)
  const clearEffect = useStore((state) => state.clearEffect)
  const updateVirtual = useStore((state) => state.updateVirtual)
  const activateDevice = useStore((state) => state.activateDevice)
  const showMatrix = useStore((state) => state.showMatrix)
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const [order, setOrder] = useState<number | 'unset'>(0)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'device-popover' : undefined

  const [_fade, setFade] = useState(false)
  const [_isActive, setIsActive] = useState<boolean>(
    (virtuals &&
      virtual &&
      virtuals[virtual] &&
      virtuals[virtual].effect &&
      Object.keys(virtuals[virtual].effect)?.length > 0) ||
      (devices &&
        devices[Object.keys(devices).find((d) => d === virtual) || '']?.active_virtuals!.length > 0)
  )

  const handleDeleteDevice = () => {
    const toDelete: string[] = []
    let core = virtual
    const isComplex =
      virtual.endsWith('-mask') ||
      virtual.endsWith('-foreground') ||
      virtual.endsWith('-background')
    if (isComplex) {
      core = virtual.replace(/-mask|-foreground|-background/g, '')
      if (virtuals[core].effect.type === 'blender') {
        removeEffectfromHistory('blender', core).then(() => {
          setTimeout(() => {
            getVirtuals()
            getDevices()
          }, 500)
        })
      }
    }
    Object.keys(virtuals).map((v) => {
      if (
        (!isComplex && v === core) ||
        v === `${core}-mask` ||
        v === `${core}-foreground` ||
        v === `${core}-background`
      ) {
        toDelete.push(v)
      }
      return null
    })
    Promise.all(toDelete.map(async (v) => await deleteVirtual(virtuals[v]?.id))).then(() => {
      getVirtuals()
    })
  }

  const handleEditVirtual = () => {
    setDialogOpenAddVirtual(true, virtual)
  }
  const handleEditDevice = (device: any) => {
    setDialogOpenAddDevice(true, device)
  }

  const handleClearEffect = () => {
    clearEffect(virtual).then(() => {
      setFade(true)
      setTimeout(
        () => {
          getVirtuals()
          getDevices()
        },
        (virtuals[virtual].config.transition_time || 0) * 1000
      )
      setTimeout(
        () => {
          setFade(false)
        },
        (virtuals[virtual].config.transition_time || 0) * 1000 + 300
      )
    })
  }

  const handlePlayPause = () => {
    updateVirtual(virtuals[virtual].id, !virtuals[virtual].active).then(() => getVirtuals())
  }

  const handleActivateDevice = (e: any) => {
    activateDevice(e).then(() => getDevices())
  }

  useEffect(() => {
    setIsActive(
      (virtual && virtuals[virtual] && Object.keys(virtuals[virtual]?.effect)?.length > 0) ||
        devices[Object.keys(devices).find((d) => d === virtual) || '']?.active_virtuals!.length > 0
    )
  }, [virtuals, devices, virtual])

  useEffect(() => {
    // initial device order if not set
    const v = JSON.parse(JSON.stringify(virtualOrder)) as IVirtualOrder[]
    Object.keys(virtuals).map((s, i) => {
      if (!v.some((o) => o.virtId === s)) {
        return v.push({ virtId: s, order: i })
      }
      return null
    })
    setVirtualOrder(v)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtuals])

  const moveLeft = () => {
    const v = JSON.parse(JSON.stringify(virtualOrder)) as IVirtualOrder[]
    const index = v.findIndex((o) => o.virtId === virtual)
    if (index === 0) return

    // Swap the order values
    const tempOrder = v[index].order
    v[index].order = v[index - 1].order
    v[index - 1].order = tempOrder

    // Ensure the order values are unique and sequential
    v.sort((a, b) => a.order - b.order).forEach((item, idx) => {
      item.order = idx
    })

    setVirtualOrder(v)
    handleClose()
  }

  const moveRight = () => {
    const v = JSON.parse(JSON.stringify(virtualOrder)) as IVirtualOrder[]
    const index = v.findIndex((o) => o.virtId === virtual)
    if (index === v.length - 1) return

    // Swap the order values
    const tempOrder = v[index].order
    v[index].order = v[index + 1].order
    v[index + 1].order = tempOrder

    // Ensure the order values are unique and sequential
    v.sort((a, b) => a.order - b.order).forEach((item, idx) => {
      item.order = idx
    })

    setVirtualOrder(v)
    handleClose()
  }

  useEffect(() => {
    const preOrder = () => {
      const customOrder = virtualOrder.find((o) => o.virtId === virtual)?.order
      if (customOrder !== undefined) {
        return customOrder
      }
      return 'unset'
    }
    setOrder(preOrder())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [virtualOrder])

  return virtual && virtuals[virtual] ? (
    <>
      <DeviceCard
        onContextMenu={(e: any) => {
          e.preventDefault()
          e.stopPropagation()
          handleClick(e)
        }}
        deviceName={virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.name}
        online={devices[Object.keys(devices).find((d) => d === virtual) || '']?.online}
        lastEffect={
          virtuals[virtual]?.last_effect
            ? schemas.effects?.[virtuals[virtual]?.last_effect]?.name
            : null
        }
        virtId={virtual}
        index={index}
        handlePlayLast={() => handlePlayPause()}
        handleDeleteDevice={() => handleDeleteDevice()}
        handleEditVirtual={() => handleEditVirtual()}
        handleEditDevice={() => handleEditDevice(virtuals[virtual]?.is_device)}
        handleClearEffect={() => handleClearEffect()}
        handlePlayPause={() => handlePlayPause()}
        linkTo={`/device/${virtuals[virtual]?.id}`}
        iconName={
          virtuals[virtual]?.config &&
          virtuals[virtual]?.config.icon_name &&
          virtuals[virtual]?.config.icon_name
        }
        effectName={virtuals[virtual]?.effect?.name}
        graphsActive={graphs && graphsMulti}
        graphsMulti={graphsMulti}
        showMatrix={showMatrix}
        isDevice={virtuals[virtual]?.is_device}
        activateDevice={handleActivateDevice}
        colorIndicator={false}
        isPlaying={virtuals[virtual]?.active}
        transitionTime={(virtuals[virtual].config.transition_time || 0) * 1000}
        isStreaming={
          devices[Object.keys(devices).find((d) => d === virtual) || '']?.active_virtuals!.length >
          0
        }
        previewOnly={virtual && virtuals[virtual]?.config && virtuals[virtual]?.config.preview_only}
        dummy={devices[Object.keys(devices).find((d) => d === virtual) || '']?.type === 'dummy'}
        isEffectSet={Object.keys(virtuals[virtual]?.effect)?.length > 0}
        additionalStyle={{
          order
        }}
      />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
      >
        <Button variant="text" onClick={moveLeft}>
          <ArrowBackIos />
        </Button>
        <Button variant="text" onClick={moveRight}>
          <ArrowForwardIos />
        </Button>
      </Popover>
    </>
  ) : null
}

export default DeviceCardWrapper
