import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import {
  Avatar,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
  Tooltip,
} from '@material-ui/core';
import { pageUrls } from '../../../../../store/constant';

import CustomIcon from '../CustomIcon/index';

import Chip from '../../../../../component/Chip';
import * as actionTypes from '../../../../../store/actions';

const useStyles = makeStyles((theme) => ({
  listIcon: {
    minWidth: '36px',
    alignSelf: 'stretch',
  },
  listItem: {
    borderRadius: '5px',
    marginBottom: '5px',
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
  },
  listItemNoBack: {
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '5px',
  },
  listCustomIcon: {
    width: '20px',
    height: '30px',
  },
}));

const NavItem = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const history = useHistory();
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const { item, level, drawerToggle, drawerOpen } = props;
  const matchDownXs = useMediaQuery(theme.breakpoints.down('xs'));

  const itemIcon = (
    <CustomIcon
      type={item?.icon_type}
      svg={item?.svg}
      base64={item?.icon_base64}
      name={item?.icon || ''}
      className={classes.listCustomIcon}
      color="inherit"
      fontSize={level > 0 ? 'inherit' : 'default'}
    />
  );

  let itemIconClass = !item.icon ? classes.listIcon : classes.menuIcon;

  let itemTarget = '';
  if (item.target) {
    itemTarget = '_blank';
  }

  let listItemProps = { component: 'a', href: item.url, target: '_blank' };

  function handleClickItem(item) {
    if (matchDownXs) drawerToggle();
    dispatch({ type: actionTypes.MENU_OPEN, isOpen: item.id });
    dispatch({ type: actionTypes.SELECTED_FOLDER_CHANGE, selectedFolder: item });
    if (window.location.pathname !== pageUrls.dashboard) {
      history.push(pageUrls.dashboard);
    }
  }

  return (
    <Tooltip title={<Typography fontSize={16}>{item.name}</Typography>} placement="right" arrow>
      <ListItem
        disabled={item.disabled}
        className={level > 1 ? classes.listItemNoBack : classes.listItem}
        selected={customization.isOpen === item.id}
        component={Link}
        onClick={() => handleClickItem(item)}
        to={item.url}
        target={itemTarget}
        button
        style={{ paddingLeft: item.children.length === 0 ? '32px' : level * 16 + 'px' }}
        {...listItemProps}
      >
        <ListItemIcon className={itemIconClass}>{itemIcon}</ListItemIcon>
        {drawerOpen && (
          <ListItemText
            primary={
              <Typography
                variant={customization.isOpen === item.id ? 'subtitle1' : 'body1'}
                color="inherit"
                className={classes.listItemTypography}
              >
                {item.name}
              </Typography>
            }
            secondary={
              item.caption && (
                <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                  {item.caption}
                </Typography>
              )
            }
          />
        )}
        {item.chip && (
          <Chip
            color={item.chip.color}
            variant={item.chip.variant}
            size={item.chip.size}
            label={item.chip.label}
            avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
          />
        )}
      </ListItem>
    </Tooltip>
  );
};

export default NavItem;
