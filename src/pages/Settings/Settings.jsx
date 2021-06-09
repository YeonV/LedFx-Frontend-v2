import { useEffect } from 'react';
import useStore from '../../utils/apiStore';
import AudioInputs from './AudioInputs';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { Button, Divider } from '@material-ui/core';

import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';

import { Delete, Refresh } from '@material-ui/icons';

import PopoverSure from '../../components/Popover';
import { download } from '../../utils/helpers';

const useStyles = makeStyles(theme => ({
  content: {
    display: 'flex',
    flexDirection: 'column',
  },
  actionButton: {
    marginTop: '0.5rem',
    width: '100%',
    borderColor: theme.palette.grey[400]
  },
  card: {
    maxWidth: '540px'
  },
  '@media (max-width: 580px)': {
    card: {
      maxWidth: '87vw'
    },
  },
}));

const Settings = () => {
  const classes = useStyles();
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const deleteSystemConfig = useStore((state) => state.deleteSystemConfig);
  const importSystemConfig = useStore((state) => state.importSystemConfig);
  const shutdown = useStore((state) => state.shutdown);
  const restart = useStore((state) => state.restart);
  const config = useStore((state) => state.config);

  const configDownload = async () => {
    const newConfig = { ...config, ...{ ledfx_presets: undefined } }
    download(
      newConfig,
      'config.json',
      'application/json',
    );
  };

  const configDelete = async () => {
    deleteSystemConfig().then(() => window.location = window.location.href)
  }

  const fileChanged = async (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
      importSystemConfig(e.target.result).then(() => (window.location = window.location.href));
    };
  }

  useEffect(() => {
    getSystemConfig();

  }, [getSystemConfig]);

  return (
    <Card className={classes.card} style={{ marginBottom: '2rem' }}>
      <CardHeader title="General" subheader="Configure LedFx-Settings" />
      <CardContent className={classes.content}>
        <AudioInputs />

        <Divider style={{ margin: '1rem 0' }} />
        <Button
          size="small"
          startIcon={<CloudUploadIcon />}
          variant="outlined"
          className={classes.actionButton}
          style={{ marginTop: '1.5rem' }}
          onClick={configDownload}
        >
          Export Config
        </Button>
        <PopoverSure
          startIcon={<Delete />}
          label="Reset Config"
          size="small"
          variant="outlined"
          color="inherit"
          className={classes.actionButton}
          onConfirm={configDelete}
          direction="center"
          vertical="top"
        />
        <input
          hidden
          accept="application/json"
          id="contained-button-file"
          type="file"
          onChange={(e) => fileChanged(e)}
        />
        <label htmlFor="contained-button-file">
          <Button
            component="span"
            size="small"
            startIcon={<CloudDownloadIcon />}
            variant="outlined"
            className={classes.actionButton}
          >
            Import Config
          </Button>
        </label>
        <Button
          size="small"
          startIcon={<Refresh />}
          variant="outlined"
          className={classes.actionButton}
          onClick={restart}

        >
          Restart LedFx
                        </Button>
        {parseInt(window.localStorage.getItem('BladeMod')) > 10 && (
          <>

            <Button
              size="small"
              startIcon={<Refresh />}
              variant="outlined"
              className={classes.actionButton}
              disabled
            >
              Check Updates
            </Button>
          </>
        )}
        <Button
          size="small"
          startIcon={<PowerSettingsNewIcon />}
          variant="outlined"
          className={classes.actionButton}
          onClick={shutdown}
        >
          Shutdown
        </Button>

      </CardContent>
    </Card>
  );
};

export default Settings;
