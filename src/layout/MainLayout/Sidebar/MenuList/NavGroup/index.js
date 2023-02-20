import React from 'react';
import { List, Typography } from '@material-ui/core';
import NavItem from './../NavItem';
import NavCollapse from './../NavCollapse';

const NavGroup = (props) => {
  const { item, drawerToggle, drawerOpen } = props;

  const items = item.children.map((menu, index) => {
    const type = menu.children && menu.children.length ? 'collapse' : 'item';
    switch (type) {
      case 'collapse':
        return <NavCollapse key={index} menu={menu} level={1} drawerToggle={drawerToggle} drawerOpen={drawerOpen} />;
      case 'item':
        return <NavItem key={index} item={menu} level={1} drawerToggle={drawerToggle} drawerOpen={drawerOpen} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Menu Items Error xxx
          </Typography>
        );
    }
  });

  return <List>{items}</List>;
};

export default NavGroup;
