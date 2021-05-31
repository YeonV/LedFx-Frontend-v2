import { useState, useEffect } from "react";
import useStore from "../utils/apiStore";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Icon from '@material-ui/core/Icon';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Wled from "../assets/Wled";
import { camelToSnake } from "../utils/helpers";
import Popover from "../components/Popover";

const useStyles = makeStyles({
  root: {
    width: "min(95vw, 345px)"
  },
  media: {
    height: 140,
  },
  iconMedia: {
    height: 140,
    display: "flex",
    alignItems: 'center',
    margin: "0 auto",
    fontSize: 100,
    "& > span:before": {
      position: 'relative'
    }
  },
});

const Scenes = () => {
  const classes = useStyles();
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const addScene = useStore((state) => state.addScene);
  const activateScene = useStore((state) => state.activateScene);
  const deleteScene = useStore((state) => state.deleteScene);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");


  const addSceneDialog = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleAddScene = (e) => {
    addScene({ name: name, scene_image: image }).then(() => {
      getScenes()
    });
    setName("");
    setImage("");
    setOpen(false);
  };

  const handleActivateScene = (e) => {
    console.log(e)
    activateScene(e)
    setOpen(false);
  };

  const handleDeleteScene = (e) => {
    deleteScene(e).then(() => {
      getScenes()
    });
    setOpen(false);

  };

  const sceneImage = (iconName) => iconName &&
    iconName.startsWith("image:") ? (
    <CardMedia
      className={classes.media}
      image={iconName.split("image:")[1]}
      title="Contemplative Reptile"
    />
  ) :

    (<Icon className={classes.iconMedia}
      color={
        // d.effect && d.effect.active === true ? "primary" : "inherit"
        "inherit"
      }
      style={{ position: "relative" }}
    >
      {iconName.startsWith("wled") ? (
        <Wled />
      ) : iconName.startsWith("mdi:") ? (
        <span
          className={`mdi mdi-${iconName.split("mdi:")[1]
            }`}
        ></span>
      ) : (
        camelToSnake(
          iconName || "SettingsInputComponent"
        )
      )}
    </Icon>)

  useEffect(() => {
    getScenes();
  }, [getScenes]);
  return (
    <div>
      <h1>Scenes</h1>
      <Grid container spacing={2}>
        {scenes && Object.keys(scenes).map((s, i) => <Grid item key={i}><Card className={classes.root}>
          <CardActionArea style={{ background: '#090909' }} onClick={() => handleActivateScene({ id: s })}>
            {sceneImage(scenes[s].scene_image || 'Wallpaper')}
            {/* <CardMedia
              className={classes.media}
              image={images[i % 3]}
              title="Contemplative Reptile"
            /> */}
          </CardActionArea>
          <CardActions style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography gutterBottom variant="h5" component="h2">
              {scenes[s].name || s}
            </Typography>

            <Popover onConfirm={() => handleDeleteScene(s)} variant="outlined" />

          </CardActions>
        </Card>
        </Grid>)}
        <Grid item><Card className={classes.root}>
          <CardActionArea style={{ background: '#090909' }} onClick={() => addSceneDialog()}>
            {sceneImage("Add")}
            {/* <CardMedia
              className={classes.media}
              image={images[i % 3]}
              title="Contemplative Reptile"
            /> */}
          </CardActionArea>
          <CardActions style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography gutterBottom variant="h5" component="h2">
              Add Scene
            </Typography>
          </CardActions>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Scene</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Image is optional and can be one of:
                <li>Wled</li>
                <li>IconName</li>
                <li>mdi:icon-name</li>
                <li>image:custom-url</li>
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                margin="dense"
                id="scene_image"
                label="Image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
          </Button>
              <Button onClick={handleAddScene} color="primary">
                Add
          </Button>
            </DialogActions>
          </Dialog>
        </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Scenes;
