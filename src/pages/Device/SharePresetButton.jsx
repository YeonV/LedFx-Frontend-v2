import { useLongPress } from 'use-long-press';
import { Button } from '@material-ui/core';
import { Share } from '@material-ui/icons';

const SharePresetButton = ({onLongPress, onShortPress}) => {
    const longPress = useLongPress((e) => onLongPress(), {
        onCancel: e => {
          onShortPress()
        },
        treshhold: 1000,
        captureEvent: true,
      });
    return (
        <Button
            color="primary"
            style={{ minWidth: 'unset', padding: '4px 4px', border: '1px solid #444' }}
            {...longPress}>
            <Share />
        </Button>
    )
}

export default SharePresetButton
