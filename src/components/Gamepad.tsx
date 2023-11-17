import { SportsEsports } from '@mui/icons-material'
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  FormControl,
  MenuItem,
  Select,
  Stack,
  Tooltip
} from '@mui/material'
import { useState } from 'react'
import { useGamepads } from 'react-gamepads'
import useStore from '../store/useStore'

const Gamepad = ({ setScene }: any) => {
  const scenes = useStore((state) => state.scenes)

  const [open, setOpen] = useState<boolean>(false)
  const [pad, setPad] = useState<any>()
  useGamepads((g) => {
    if (g[0]) setPad(g[0])
  })

  const [mapping, setMapping] = useState<Record<number, string>>({})
  return pad?.id ? (
    <div>
      <Tooltip title={pad.id}>
        <Fab color="primary" aria-label="gamepad" onClick={() => setOpen(true)}>
          <SportsEsports />
        </Fab>
      </Tooltip>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { maxWidth: 480 } }}
      >
        <DialogTitle display="flex" alignItems="center">
          <SportsEsports sx={{ mr: 2 }} /> Gamepad detected
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{pad?.id}</DialogContentText>
          <DialogContentText sx={{ mt: 2 }}>
            Assign scenes to buttons
          </DialogContentText>
          <DialogContentText>
            Note: This is a just proof of concept! Keep this dialog open while
            using the gamepad. Mapping is NOT saved and will be lost on closing
            the dialog.
          </DialogContentText>
          <Stack direction="column" spacing={1} sx={{ mt: 2 }}>
            {pad?.buttons.map((b: any, i: number) => {
              if (b.pressed && mapping[i] && mapping[i] !== 'none') {
                setScene(mapping[i])
              }
              return (
                <Stack key={i} direction="row" alignItems="center" spacing={1}>
                  <Fab
                    size="small"
                    color={b.pressed ? 'primary' : 'inherit'}
                    key={i}
                    sx={{ background: b.pressed ? '#0dbedc' : '#333', m: 1 }}
                  >
                    {i}
                  </Fab>
                  <FormControl fullWidth>
                    <Select
                      style={{
                        color: 'white'
                      }}
                      labelId="scene-select-label"
                      label="Scene"
                      value={mapping[i] || 'none'}
                      onChange={(e) =>
                        setMapping({ ...mapping, [i]: e.target.value })
                      }
                    >
                      <MenuItem value="none" key="none">
                        no scene assigned
                      </MenuItem>
                      {Object.keys(scenes).map((s: string) => (
                        <MenuItem key={s} value={s}>
                          {scenes[s]?.name || s}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              )
            })}
          </Stack>
        </DialogContent>
      </Dialog>
    </div>
  ) : null
}

export default Gamepad
