import { Add, Delete, DeleteSweep, PlayArrow, Stop } from '@mui/icons-material'
import { Button, Divider, TextField } from '@mui/material'
import { useRef, useState } from 'react'
import useStore from '../../store/useStore'
import Popover from '../Popover/Popover'

const Instances = ({
  port,
  i,
  instance,
  instances,
  variant
}: {
  port: string
  i: number
  instance: string | false
  instances: number[]
  variant: 'buttons' | 'line'
}) => {
  const [newPort, setNewPort] = useState<number>(port ? parseInt(port, 10) : 0)
  const coreStatus = useStore((state) => state.coreStatus)
  const portRef = useRef<HTMLInputElement>(null)
  const handleStartCore = (e: any, p: number) => {
    e.stopPropagation()
    ;(window as any).api.send('toMain', {
      command: 'start-core-instance',
      instance: instance || `instance${i}`,
      port: p
    })
  }
  const handleStopCore = (e: any, p: number) => {
    e.stopPropagation()
    ;(window as any).api.send('toMain', {
      command: 'stop-core-instance',
      instance,
      port: p
    })
  }
  const handleDelete = (e: any, p: number) => {
    e.stopPropagation()
    if (instance) {
      ;(window as any).api.send('toMain', {
        command: 'delete-core-instance',
        instance,
        port: p
      })
    } else {
      ;(window as any).api.send('toMain', {
        command: 'delete-core-params',
        instance: 'all'
      })
    }
  }

  return instance ? (
    <div key={port} style={{ marginBottom: '0.75rem' }}>
      <div style={{ display: 'flex' }}>
        <TextField
          disabled
          inputRef={portRef}
          onChange={(e) => {
            setNewPort(parseInt(e.target.value, 10))
          }}
          size="small"
          type="number"
          label={variant === 'line' ? '' : 'port'}
          variant={variant === 'line' ? 'standard' : 'outlined'}
          value={newPort}
          sx={{
            minWidth: '90px',
            width: '90px',
            marginRight: '0.5rem'
          }}
          InputProps={{
            disableUnderline: variant === 'line',
            sx: {
              color:
                variant === 'line' && !instance && instances.includes(newPort)
                  ? 'error.main'
                  : 'inherit'
            }
          }}
        />
        <TextField
          label={variant === 'line' ? '' : 'status'}
          variant={variant === 'line' ? 'standard' : 'outlined'}
          value={coreStatus[instance] || 'stopped'}
          InputProps={{
            disableUnderline: variant === 'line',
            inputProps: { tabIndex: -1 },
            sx: {
              color:
                coreStatus[instance] === 'starting'
                  ? 'warning.main'
                  : coreStatus[instance] === 'running'
                    ? 'success.main'
                    : 'text.disabled'
            }
          }}
          InputLabelProps={{
            shrink: true
          }}
          size="small"
          sx={{
            minWidth: '110px',
            width: '110px',
            marginRight: '0.5rem',
            pointerEvents: 'none'
          }}
        />
        {variant === 'line' && (
          <>
            <TextField
              label={variant === 'line' ? '' : 'status'}
              variant={variant === 'line' ? 'standard' : 'outlined'}
              value={instance}
              InputProps={{
                disableUnderline: variant === 'line',
                inputProps: { tabIndex: -1 },
                sx: {
                  color: 'text.disabled'
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              size="small"
              sx={{
                minWidth: '110px',
                width: '110px',
                marginRight: '0.5rem',
                pointerEvents: 'none'
              }}
            />
            <TextField
              label={variant === 'line' ? '' : 'status'}
              variant={variant === 'line' ? 'standard' : 'outlined'}
              value={instance}
              InputProps={{
                disableUnderline: variant === 'line',
                inputProps: { tabIndex: -1 },
                sx: {
                  color: 'text.disabled'
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              size="small"
              sx={{
                minWidth: '110px',
                width: '110px',
                marginRight: '0.5rem',
                pointerEvents: 'none'
              }}
            />
          </>
        )}
        <Button
          disabled={
            coreStatus[instance] === 'starting' ||
            coreStatus[instance] === 'running'
          }
          variant={variant === 'line' ? 'text' : 'outlined'}
          sx={variant === 'line' ? { minWidth: '32px', width: '32px' } : {}}
          aria-label="delete"
          onClick={(e) => {
            handleStartCore(e, newPort || parseInt(port, 10) || 8889)
          }}
        >
          <PlayArrow />
        </Button>

        <Button
          disabled={coreStatus[instance] !== 'running'}
          variant={variant === 'line' ? 'text' : 'outlined'}
          sx={variant === 'line' ? { minWidth: '32px', width: '32px' } : {}}
          aria-label="stop"
          onClick={(e) => {
            handleStopCore(e, newPort || parseInt(port, 10) || 8889)
          }}
        >
          <Stop />
        </Button>

        <Popover
          color="inherit"
          disabled={
            coreStatus[instance] === 'starting' ||
            coreStatus[instance] === 'running'
          }
          icon={<Delete />}
          style={
            variant === 'line'
              ? { minWidth: '32px', width: '32px' }
              : { height: 40 }
          }
          variant={variant === 'line' ? 'text' : 'outlined'}
          onConfirm={(e) =>
            handleDelete(
              e,
              parseInt(`${port}` || portRef.current?.value || '', 10) || 8889
            )
          }
        />
      </div>
      {variant === 'line' && <Divider />}
    </div>
  ) : (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Popover
        color="inherit"
        content={
          <>
            <TextField
              label="instance"
              variant="outlined"
              value={`instance${i}`}
              InputProps={{
                disableUnderline: variant === 'line',
                inputProps: { tabIndex: -1 },
                sx: {
                  color: 'text.disabled'
                }
              }}
              InputLabelProps={{
                shrink: true
              }}
              size="small"
              sx={{
                minWidth: '110px',
                width: '110px',
                margin: '0.5rem',
                pointerEvents: 'none'
              }}
            />

            <TextField
              disabled={!!instance}
              error={!instance && instances.includes(newPort)}
              inputRef={portRef}
              onChange={(e) => {
                setNewPort(parseInt(e.target.value, 10))
              }}
              size="small"
              type="number"
              label="port"
              variant="outlined"
              value={newPort}
              sx={{
                minWidth: '100px',
                width: '100px',
                margin: '0.5rem 1rem 0.5rem 0.5rem'
              }}
              InputProps={{
                disableUnderline: variant === 'line',
                sx: {
                  color:
                    variant === 'line' &&
                    !instance &&
                    instances.includes(newPort)
                      ? 'error.main'
                      : 'inherit'
                }
              }}
            />
          </>
        }
        icon={<Add />}
        confirmDisabled={instances.includes(
          portRef.current?.value
            ? parseInt(portRef.current?.value, 10)
            : newPort
        )}
        variant={variant === 'line' ? 'text' : 'outlined'}
        style={variant === 'line' ? { minWidth: '32px', width: '32px' } : {}}
        aria-label="delete"
        onConfirm={(e) => {
          handleStartCore(
            e,
            (portRef.current?.value
              ? parseInt(portRef.current?.value, 10)
              : newPort) ||
              parseInt(port, 10) ||
              8889
          )
          if (portRef.current?.value) {
            portRef.current.value = `${parseInt(portRef.current.value, 10) + 1}`
            setNewPort(parseInt(portRef.current?.value, 10))
          }
        }}
      />
      <Popover
        color="inherit"
        icon={<DeleteSweep />}
        style={
          variant === 'line'
            ? { minWidth: '32px', width: '32px' }
            : instance
              ? { height: 40 }
              : {}
        }
        variant={variant === 'line' ? 'text' : 'outlined'}
        onConfirm={(e) =>
          handleDelete(
            e,
            parseInt(`${port}` || portRef.current?.value || '', 10) || 8889
          )
        }
      />
    </div>
  )
}

export default Instances
