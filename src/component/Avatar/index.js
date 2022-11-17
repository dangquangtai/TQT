import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import MuiAvatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme) => ({
    primaryBackground: {
        background: theme.palette.primary.main,
    },
    secondaryBackground: {
        background: theme.palette.secondary.main,
    },
    errorBackground: {
        background: theme.palette.error.main,
    },
    warningBackground: {
        background: theme.palette.warning.main,
    },
    infoBackground: {
        background: theme.palette.info.main,
    },
    successBackground: {
        background: theme.palette.success.main,
    },
    greyBackground: {
        background: theme.palette.grey[500],
    },
    primaryOutline: {
        background: theme.palette.common.white,
        color: theme.palette.primary.main,
        border: '2px solid ' + theme.palette.primary.main,
    },
    secondaryOutline: {
        background: theme.palette.common.white,
        color: theme.palette.secondary.main,
        border: '2px solid ' + theme.palette.secondary.main,
    },
    errorOutline: {
        background: theme.palette.common.white,
        color: theme.palette.error.main,
        border: '2px solid ' + theme.palette.error.main,
    },
    warningOutline: {
        background: theme.palette.common.white,
        color: theme.palette.warning.main,
        border: '2px solid ' + theme.palette.warning.main,
    },
    infoOutline: {
        background: theme.palette.common.white,
        color: theme.palette.info.main,
        border: '2px solid ' + theme.palette.info.main,
    },
    successOutline: {
        background: theme.palette.common.white,
        color: theme.palette.success.main,
        border: '2px solid ' + theme.palette.success.main,
    },
    greyOutline: {
        background: theme.palette.common.white,
        color: theme.palette.grey[500],
        border: '2px solid ' + theme.palette.grey[500],
    },
    small: {
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    large: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

const Avatar = (props) => {
    const classes = useStyles();
    const { color, outline, size, className, ...rest } = props;
    let avatarClass = [];

    avatarClass = color
        ? outline
            ? [classes[color + 'Outline'], ...avatarClass]
            : [classes[color + 'Background'], ...avatarClass]
        : avatarClass;
    avatarClass = size ? [classes[size], ...avatarClass] : avatarClass;
    if (className) {
        avatarClass = className ? [...avatarClass, className] : avatarClass;
    }

    return <MuiAvatar className={avatarClass.join(' ')} {...rest} />;
};

export default Avatar;
