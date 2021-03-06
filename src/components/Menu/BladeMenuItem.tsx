import React from 'react';
import MenuItem from '@material-ui/core/Menu';

const BladeMenuItem = React.forwardRef((props, ref) => {
  return <MenuItem ref={ref} open={false} {...props} />;
});

export default BladeMenuItem;
