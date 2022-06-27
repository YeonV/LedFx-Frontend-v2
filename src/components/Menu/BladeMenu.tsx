import React from 'react';
import Menu from '@material-ui/core/Menu';

const BladeMenu = React.forwardRef((props, ref) => {
  return <Menu ref={ref} open={false} {...props} />;
});

export default BladeMenu;
