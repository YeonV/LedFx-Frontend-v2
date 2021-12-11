import { IconButton } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import LanguageIcon from '@material-ui/icons/Language';
import ForumIcon from '@material-ui/icons/Forum';

const ButtonBar = ({ classes }) => {
    return (
        <div style={{
            position: 'relative',
            bottom: 0,
            left: 0,
            right: 0,
            paddingTop: '0.4rem',
            paddingBottom: '0.4rem',
            textAlign: 'center',
            color: '#FFFFFF',
            '& > a': {
                margin: '0 5px',
            },
        }}>
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
                href="https://discord.gg/tFSKgTzRcj"
                target="_blank"
                title="Discord"
            >
                <ForumIcon />
            </IconButton>
        </div>
    );
};

export default ButtonBar;