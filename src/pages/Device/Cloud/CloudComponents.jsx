import React from 'react';

import axios from 'axios';
import { Slide, MenuItem } from '@material-ui/core';


export const cloud = axios.create({
    baseURL: 'https://strapi.yeonv.com',
});

export const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const MuiMenuItem = React.forwardRef((props, ref) => {
    return <MenuItem ref={ref} {...props} />;
});