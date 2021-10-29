import useStore from '../../utils/apiStore';
import { deleteFrontendConfig, download } from '../../utils/helpers';
import { CloudUpload, CloudDownload, PowerSettingsNew, Delete, Refresh, Info } from '@material-ui/icons';
import PopoverSure from '../../components/Popover';

import AboutDialog from '../../components/Dialogs/AboutDialog';
import isElectron from 'is-electron';
import { useStyles, SettingsButton } from './SettingsComponents'

const GeneralCard = () => {

    const classes = useStyles();
    const getFullConfig = useStore((state) => state.getFullConfig);
    const deleteSystemConfig = useStore((state) => state.deleteSystemConfig);
    const importSystemConfig = useStore((state) => state.importSystemConfig);
    const shutdown = useStore((state) => state.shutdown);
    const restart = useStore((state) => state.restart);
    const disconnected = useStore((state) => state.disconnected);

    const configDownload = async () => {
        getFullConfig().then((newConfig) => download(
            newConfig,
            'config.json',
            'application/json',
        ))
    };

    const configDelete = async () => {
        deleteFrontendConfig();
        deleteSystemConfig().then(() => window.location = window.location.href)
    }

    const fileChanged = async (e) => {
        const fileReader = new FileReader();
        fileReader.readAsText(e.target.files[0], "UTF-8");
        fileReader.onload = (e) => {
            importSystemConfig(e.target.result).then(() => (window.location = window.location.href));
        };
    }

    return (
        <div className={'step-settings-four'} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ flex: '0 0 49%' }}>
                <SettingsButton startIcon={<CloudUpload />} onClick={configDownload}>
                    Export Config
                </SettingsButton>
                <PopoverSure
                    startIcon={<Delete />}
                    label="Reset Config"
                    variant="outlined"
                    color="inherit"
                    className={classes.actionButton}
                    onConfirm={configDelete}
                    direction="center"
                    vertical="top"
                    wrapperStyle={{
                        marginTop: '0.5rem',
                        flexBasis: '49%',
                    }}
                />
                <input
                    hidden
                    accept="application/json"
                    id="contained-button-file"
                    type="file"
                    onChange={(e) => fileChanged(e)}
                />
                <label htmlFor="contained-button-file" style={{ width: '100%', flexBasis: '49%' }}>
                    <SettingsButton component="span" startIcon={<CloudDownload />}>
                        Import Config
                    </SettingsButton>
                </label>
                {isElectron() && window.process?.argv.indexOf("integratedCore") !== -1 &&
                    <SettingsButton startIcon={<CloudUpload />} onClick={() => window.api.send('toMain', "open-config")}>
                        Config Location
                    </SettingsButton>}
            </div>
            <div style={{ flex: '0 0 49%' }}>
                <AboutDialog startIcon={<Info />} className={classes.actionButton}>
                    About
                </AboutDialog>
                <SettingsButton disabled={disconnected} startIcon={<Refresh />} onClick={restart}>
                    {isElectron() && window.process?.argv.indexOf("integratedCore") !== -1 ? "Restart Core" : "Restart"}
                </SettingsButton>

                <SettingsButton disabled={disconnected} startIcon={<PowerSettingsNew />} onClick={shutdown}>
                    {isElectron() && window.process?.argv.indexOf("integratedCore") !== -1 ? "Shutdown Core" : "Shutdown"}
                </SettingsButton>
                {isElectron() && window.process?.argv.indexOf("integratedCore") !== -1 &&
                    <SettingsButton startIcon={<PowerSettingsNew />} onClick={() => { window.api.send('toMain', "start-core") }}>
                        Start Core
                    </SettingsButton>}
            </div>
        </div>
    )
}

export default GeneralCard
