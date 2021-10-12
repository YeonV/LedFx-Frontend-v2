import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Button, IconButton } from '@material-ui/core';
import { Info } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
    wrapper: {
        minWidth: '200px',
        padding: '16px 1.2rem 6px 1.2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: 'auto',
        margin: '0.5rem 0',
        "@media (max-width: 580px)": {
            width: '100% !important',
            margin: '0.5rem 0',
        },
        '& > label': {
            top: '-0.5rem',
            display: 'flex',
            alignItems: 'center',
            left: '1rem',
            padding: '0 0.3rem',
            position: 'absolute',
            fontVariant: 'all-small-caps',
            fontSize: '0.9rem',
            letterSpacing: '0.1rem',
            backgroundColor: theme.palette.background.paper,
            boxSizing: 'border-box',
        },
    },
}));

const BladeFrame = ({ title, children, full = false, style = { width: 'unset' }, order, required = false, variant = 'outlined', className, disabled }) => {
    const classes = useStyles();
    return (variant === 'outlined' ? (
        <div className={`${classes.wrapper} ${className}`} style={{
            order: order || (title === 'Name' ? -2 : required ? -1 : 1),
            ...style,
            width: full ? '100%' : style.width
        }}>
            <label className={`MuiFormLabel-root${disabled ? ' Mui-disabled' : ''}`} onClick={()=>alert(1)}>{title}{required ? '*' : ''}</label>
            {children}
        </div>
    ) : (
        children
    ))
}

export default BladeFrame
