import { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

import useStore from '../../utils/apiStore';
import Wled from '../../assets/Wled';
import { camelToSnake } from '../../utils/helpers';
import Popover from '../../components/Popover';

const useStyles = makeStyles({
  root: {
    width: 'min(95vw, 345px)',   
  },
  '@media (max-width: 580px)': {
    root: {
    width: '95vw',
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
  const deleteScene = useStore((state) => state.deleteScene);
  const setDialogOpenAddScene = useStore((state) => state.setDialogOpenAddScene);

  const handleActivateScene = (e) => {
    console.log(e);
    activateScene(e);
    setDialogOpenAddScene(false);
  };

  const handleDeleteScene = (e) => {
    deleteScene(e).then(() => {
      getScenes();
    });
    setDialogOpenAddScene(false);
  };

  const sceneImage = (iconName) => (iconName
    && iconName.startsWith('image:') ? (
      <CardMedia
        className={classes.media}
        image={iconName.split('image:')[1]}
        title="Contemplative Reptile"
      />
    )

    : (
      <Icon
        className={classes.iconMedia}
        color={'inherit'}
        style={{ position: 'relative' }}
      >
        {iconName.startsWith('wled') ? (
          <Wled />
        ) : iconName.startsWith('mdi:') ? (
          <span
            className={`mdi mdi-${iconName.split('mdi:')[1]
            }`}
          />
        ) : (
          camelToSnake(
            iconName || 'SettingsInputComponent',
          )
        )}
      </Icon>
    ));

  useEffect(() => {
    getScenes();
  }, [getScenes]);
  return (
      <Grid container spacing={2}>
        {scenes && Object.keys(scenes).map((s, i) => (
          <Grid item key={i}>
            <Card className={classes.root}>
              <CardActionArea style={{ background: '#090909' }} onClick={() => handleActivateScene({ id: s })}>
                {sceneImage(scenes[s].scene_image || 'Wallpaper')}
              </CardActionArea>
              <CardActions style={{ justifyContent: 'space-between', width: '100%' }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {scenes[s].name || s}
                </Typography>

                <Popover onConfirm={() => handleDeleteScene(s)} variant="outlined" />

              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
  );
};

export default Scenes;
