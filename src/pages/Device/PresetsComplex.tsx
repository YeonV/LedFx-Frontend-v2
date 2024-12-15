import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  Menu,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Popover from '../../components/Popover/Popover'
import useStore from '../../store/useStore'
import { useState } from 'react'

const PresetsComplex = ({ virtId }: { virtId: string }) => {
  const theme = useTheme()
  const [name, setName] = useState('')
  const [valid, setValid] = useState(true)
  const [anchorEl, setAnchorEl] = useState<any>(null)
  const [sceneToDelete, setSceneToDelete] = useState<string | null>(null)
  const [open, setOpen] = useState(true)

  const virtuals = useStore((state) => state.virtuals)
  const scenes = useStore((state) => state.scenes)
  const addScene = useStore((state) => state.addScene)
  const getScenes = useStore((state) => state.getScenes)
  const activateScene = useStore((state) => state.activateScene)
  const deleteScene = useStore((state) => state.deleteScene)

  const sceneBlenderFilter = (sc: string) =>
    scenes[sc].scene_tags?.split(',')?.includes('blender') &&
    virtId &&
    sc.startsWith(virtId)

  const handleAddScene = () => {
    if (!virtId || name.length === 0) return
    addScene(`${virtId}-${name}`, 'yz:logo3', 'blender', null, null, null, {
      [virtId]: virtuals[virtId].effect,
      [`${virtId}-mask`]: virtuals[`${virtId}-mask`].effect,
      [`${virtId}-foreground`]: virtuals[`${virtId}-foreground`].effect,
      [`${virtId}-background`]: virtuals[`${virtId}-background`].effect
    }).then(() => {
      getScenes()
    })
    setName('')
  }

  return (
    <Card sx={{ padding: '16px' }} variant="outlined">
      <CardHeader
        style={{ margin: '0' }}
        title="Presets"
        subheader="complex effects utilize partial scenes for presets."
      />
      <CardContent>
        <Grid spacing={2} container>
          {Object.keys(scenes).filter(sceneBlenderFilter).length > 0 &&
            Object.keys(scenes)
              .filter(sceneBlenderFilter)
              .map((scene) => (
                <Grid item key={scene}>
                  <Button
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setSceneToDelete(scene)
                      setAnchorEl(e.currentTarget || e.target)
                    }}
                    onClick={() => {
                      activateScene(scene?.toLowerCase().replaceAll(' ', '-'))
                    }}
                  >
                    {scene.replace(virtId + '-', '')}
                  </Button>
                </Grid>
              ))}
          <Grid item key={'newPartialScene'}>
            <Popover
              open={open}
              variant="outlined"
              sxButton={{ pt: '2.25px !important', pb: '2.5px' }}
              icon={<Add />}
              content={
                <TextField
                  autoFocus
                  onKeyDown={(e: any) => {
                    // console.log(name)
                    if (
                      e.key === 'Enter' &&
                      !(
                        name.length === 0 ||
                        (scenes &&
                          (Object.keys(scenes).indexOf(`${virtId}-${name}`) >
                            -1 ||
                            Object.values(scenes).filter(
                              (p: any) => p.name === `${virtId}-${name}`
                            ).length > 0)) ||
                        !valid
                      )
                    ) {
                      handleAddScene()
                      setOpen(!open)
                    }
                  }}
                  error={
                    scenes &&
                    (Object.keys(scenes).indexOf(`${virtId}-${name}`) > -1 ||
                      Object.values(scenes).filter(
                        (p: any) => p.name === `${virtId}-${name}`
                      ).length > 0)
                  }
                  size="small"
                  id="presetNameInput"
                  label={
                    scenes &&
                    (Object.keys(scenes).indexOf(`${virtId}-${name}`) > -1 ||
                      Object.values(scenes).filter(
                        (p: any) => p.name === `${virtId}-${name}`
                      ).length > 0)
                      ? 'Partial Scene already exsisting'
                      : 'Add Partial Scene'
                  }
                  style={{ marginRight: '1rem', flex: 1 }}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (
                      scenes &&
                      (Object.keys(scenes).indexOf(e.target.value) > -1 ||
                        Object.values(scenes).filter(
                          (p: any) =>
                            p.name.replace(`${virtId}-`, '') === e.target.value
                        ).length > 0)
                    ) {
                      setValid(false)
                    } else {
                      setValid(true)
                    }
                  }}
                />
              }
              footer={
                <div style={{ margin: '0 0 0.5rem 1rem' }}>
                  <Typography
                    variant="body2"
                    sx={{ color: theme.palette.text.disabled }}
                  >
                    Save the current effect configuration as a new preset.
                  </Typography>
                </div>
              }
              confirmDisabled={
                name.length === 0 ||
                (scenes &&
                  (Object.keys(scenes).indexOf(name) > -1 ||
                    Object.values(scenes).filter(
                      (p: any) => p.name === `${virtId}-${name}`
                    ).length > 0)) ||
                !valid
              }
              onConfirm={handleAddScene}
              size="medium"
            />
          </Grid>
        </Grid>
      </CardContent>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        // className={classes.bladeMenu}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <div>
          <Popover
            type="menuItem"
            onConfirm={() =>
              sceneToDelete &&
              deleteScene(sceneToDelete).then(() => {
                getScenes()
                setAnchorEl(null)
              })
            }
            label="Delete Preset"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center'
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'center'
            }}
          />
        </div>
      </Menu>
    </Card>
  )
}

export default PresetsComplex
