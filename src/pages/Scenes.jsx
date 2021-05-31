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

const images = [
  "image:https://cdn.pixabay.com/photo/2019/12/18/04/11/dj-4702977_960_720.jpg",
  "mdi:desk",
  "image:https://cdn.pixabay.com/photo/2017/05/05/17/21/bulb-2287759_960_720.jpg",
  "wled",
  "image:https://material-ui.com/static/images/cards/contemplative-reptile.jpg",
  "Wallpaper",
  "Wallpaper",
  "Wallpaper",
  "Wallpaper",
  "Wallpaper",
  "Wallpaper",
  "Wallpaper"
]





const Scenes = () => {
  const classes = useStyles();
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  const addScene = useStore((state) => state.addScene);
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
    console.log(name, image)
    addScene({ name: name, scene_image: image }).then(() => {
      getScenes()
    });
    setOpen(false);
  };
  const handleDeleteScene = (e) => {
    console.log(e)
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
          <CardActionArea style={{ background: '#090909' }}>
            {sceneImage(images[i])}
            {/* <CardMedia
              className={classes.media}
              image={images[i % 3]}
              title="Contemplative Reptile"
            /> */}
          </CardActionArea>
          <CardActions style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography gutterBottom variant="h5" component="h2">
              {s}
            </Typography>
            <Button size="small" color="secondary">
              <Popover onConfirm={() => handleDeleteScene(s)} variant="outlined" />
            </Button>
          </CardActions>
        </Card>
        </Grid>)}
        <Grid item><Card className={classes.root}>
          <CardActionArea style={{ background: '#090909' }} onClick={() => addSceneDialog()}>
            {sceneImage("AddCircle")}
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
                <li>Icon</li>
                <li>mdi:Icon</li>
                <li>wled</li>
                <li>CustomUrl</li>
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
