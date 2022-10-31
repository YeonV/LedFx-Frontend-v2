import { useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardMedia,
  Typography,
  Grid,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import useStore from '../../store/useStore';
import Popover from '../../components/Popover/Popover';
import NoYet from '../../components/NoYet';
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon';

const useStyles = makeStyles({
  root: {
    width: 'min(92vw, 345px)',
  },
  sceneTitle: {
    fontSize: '1.5rem',
  },
  '@media (max-width: 580px)': {
    root: {
      width: '95vw',
    },
    sceneTitle: {
      fontSize: '1rem',
    },
  },
  media: {
    height: 140,
  },
  iconMedia: {
    height: 140,
    display: 'flex',
    alignItems: 'center',
    margin: '0 auto',
    fontSize: 100,
    '& > span:before': {
      position: 'relative',
    },
  },
});

const Scenes = () => {
  const classes = useStyles();
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const activateScene = useStore((state) => state.activateScene);
  const captivateScene = useStore((state) => state.captivateScene);
  const deleteScene = useStore((state) => state.deleteScene);
  const setDialogOpenAddScene = useStore(
    (state) => state.setDialogOpenAddScene
  );
  const handleActivateScene = (e: string) => {
    // console.log('captivate', e, scenes[e]);
    activateScene(e);
    if (scenes[e]?.scene_puturl && scenes[e]?.scene_payload)
      captivateScene(scenes[e]?.scene_puturl, scenes[e]?.scene_payload);
  };

  const handleDeleteScene = (e: any) => {
    deleteScene(e).then(() => {
      getScenes();
    });
  };

  const sceneImage = (iconName: string) =>
    iconName && iconName.startsWith('image:') ? (
      <CardMedia
        className={classes.media}
        image={iconName.split('image:')[1]}
        title="Contemplative Reptile"
      />
    ) : (
      <BladeIcon scene className={classes.iconMedia} name={iconName} />
    );

  useEffect(() => {
    getScenes();
  }, [getScenes]);
  return (
    <Grid
      container
      spacing={[0, 0, 2, 2, 2]}
      justifyContent="center"
      m={['0 auto', '0 auto', '0.5rem', '0.5rem', '0.5rem']}
      sx={{ maxWidth: '100%' }}
    >
      {scenes && Object.keys(scenes).length ? (
        Object.keys(scenes).map((s, i) => (
          <Grid item key={i} mt={['0.5rem', '0.5rem', 0, 0, 0]}>
            <Card className={classes.root}>
              <CardActionArea
                style={{ background: '#090909' }}
                onClick={() => handleActivateScene(s)}
              >
                {sceneImage(scenes[s].scene_image || 'Wallpaper')}
              </CardActionArea>
              <CardActions
                style={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '100%',
                }}
              >
                <Typography
                  className={classes.sceneTitle}
                  variant="h5"
                  component="h2"
                >
                  {scenes[s].name || s}
                </Typography>
                <div>
                  <Button
                    onClick={() =>
                      setDialogOpenAddScene(false, true, s, scenes[s])
                    }
                    variant="outlined"
                    color="inherit"
                    size="small"
                  >
                    <Edit />
                  </Button>
                  <Popover
                    onConfirm={() => handleDeleteScene(s)}
                    variant="outlined"
                    color="inherit"
                    style={{ marginLeft: '0.5rem' }}
                  />
                </div>
              </CardActions>
            </Card>
          </Grid>
        ))
      ) : (
        <NoYet type="Scene" />
      )}
    </Grid>
  );
};

export default Scenes;
