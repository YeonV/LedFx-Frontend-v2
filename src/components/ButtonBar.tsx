import { IconButton } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LanguageIcon from '@material-ui/icons/Language';
import ForumIcon from '@material-ui/icons/Forum';
import useStyles from './ButtonBar.styles';

const ButtonBar = () => {
  const classes = useStyles();

  return (
    <div className={classes.buttonBar}>
      <IconButton
        aria-label="Website"
        color="inherit"
        href="https://ledfx.app/"
        target="_blank"
        title="Website"
      >
        <LanguageIcon />
      </IconButton>
      <IconButton
        aria-label="Github"
        color="inherit"
        href="https://git.ledfx.app/"
        target="_blank"
        title="Github"
      >
        <GitHubIcon />
      </IconButton>
      <IconButton
        aria-label="Discord"
        color="inherit"
        href="https://discord.gg/EZf8pAZ4"
        target="_blank"
        title="Discord"
      >
        <ForumIcon />
      </IconButton>
    </div>
  );
};

export default ButtonBar;
