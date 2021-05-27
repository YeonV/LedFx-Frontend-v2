import { useEffect } from "react";
import useStore from "../utils/apiStore";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Delete from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  root: {
    width: "min(95vw, 345px)"
  },
  media: {
    height: 140,
  },
});

const images = [
  "https://cdn.pixabay.com/photo/2019/12/18/04/11/dj-4702977_960_720.jpg",
  "https://cdn.pixabay.com/photo/2017/05/05/17/21/bulb-2287759_960_720.jpg",
  "https://material-ui.com/static/images/cards/contemplative-reptile.jpg"
]
const Scenes = () => {
  const classes = useStyles();
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  useEffect(() => {
    getScenes();
  }, [getScenes]);
  return (
    <div>
      <h1>Scenes</h1>
      <Grid container spacing={2}>
        {scenes && Object.keys(scenes).map((s, i) => <Grid item><Card className={classes.root}>
          <CardActionArea>
            <CardMedia
              className={classes.media}
              image={images[i % 3]}
              title="Contemplative Reptile"
            />
          </CardActionArea>
          <CardActions style={{ justifyContent: 'space-between', width: '100%' }}>
            <Typography gutterBottom variant="h5" component="h2">
              {s}
            </Typography>
            <Button size="small" color="secondary">
              <Delete />
            </Button>
          </CardActions>
        </Card>
        </Grid>)}
      </Grid>
    </div>
  );
};

export default Scenes;
