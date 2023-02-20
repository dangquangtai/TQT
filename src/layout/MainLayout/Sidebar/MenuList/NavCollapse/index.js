import React from 'react';
import { makeStyles, Typography, ListItem, ListItemIcon, ListItemText, Collapse, List, Tooltip } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useDispatch } from 'react-redux';
import CustomIcon from '../CustomIcon/index';
import * as actionTypes from '../../../../../store/actions';
import { pageUrls } from '../../../../../store/constant';

import NavItem from './../NavItem';

const useStyles = makeStyles((theme) => ({
  collapseIcon: {
    fontSize: '1rem',
  },
  listIcon: {
    minWidth: '30px',
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
    // backgroundColor: 'transparent !important',
    paddingTop: '8px',
    paddingBottom: '8px',
    borderRadius: '5px',
  },
  listCustomIcon: {
    width: '20px',
    height: '30px',
  },
  menuText: {
    opacity: 1,
  },
  menuTextClose: {
    opacity: 0,
  },
  noWrap: {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
}));

const NavCollapse = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();

  const { menu, level, drawerToggle, drawerOpen } = props;
  const [open, setOpen] = React.useState(true);
  const [selected, setSelected] = React.useState(menu.id);

  const handleClick = (menu) => {
    dispatch({ type: actionTypes.SELECTED_FOLDER_CHANGE, selectedFolder: menu });

    if (window.location.pathname !== pageUrls.dashboard) {
      history.push(pageUrls.dashboard);
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setSelected(!selected ? menu.id : null);
    setOpen(!open);
  };

  const menus = menu.children.map((item) => {
    item.type = item.children && item.children.length ? 'collapse' : 'item';
    switch (item.type) {
      case 'collapse':
        return <NavCollapse key={item.id} menu={item} level={level + 1} drawerToggle={drawerToggle} drawerOpen={drawerOpen} />;
      case 'item':
        return <NavItem key={item.id} item={item} level={level + 1} drawerToggle={drawerToggle} drawerOpen={drawerOpen} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });
  const menuIcon = (
    <CustomIcon
      type={menu?.icon_type}
      svg={menu?.svg}
      base64={menu?.icon_base64}
      name={menu?.icon || ''}
      className={classes.listCustomIcon}
      color="inherit"
      fontSize={level > 0 ? 'inherit' : 'default'}
    />
  );

  let menuIconClass = !menu.icon ? classes.listIcon : classes.menuIcon;

  return (
    <React.Fragment>
      <Tooltip title={<Typography fontSize={17}>{menu.name}</Typography>} placement="right" arrow>
        <ListItem
          className={level > 1 ? classes.listItemNoBack : classes.listItem}
          selected={selected === menu.id}
          button
          onClick={() => handleClick(menu)}
          style={{ paddingLeft: level * 16 + 'px' }}
        >
          <ListItemIcon className={menuIconClass}>{menuIcon}</ListItemIcon>
          <ListItemText
            className={drawerOpen ? classes.menuText : classes.menuTextClose}
            primary={
              <Typography variant={selected === menu.id ? 'subtitle1' : 'body1'} color="inherit" className={classes.noWrap}>
                {menu.name}
              </Typography>
            }
            secondary={
              menu.caption && (
                <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                  {menu.caption}
                </Typography>
              )
            }
          />
          {open ? (
            <ExpandLess className={classes.collapseIcon} onClick={toggleExpand} />
          ) : (
            <ExpandMore className={classes.collapseIcon} onClick={toggleExpand} />
          )}
        </ListItem>
      </Tooltip>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {menus}
        </List>
      </Collapse>
    </React.Fragment>
  );
};

export default NavCollapse;
