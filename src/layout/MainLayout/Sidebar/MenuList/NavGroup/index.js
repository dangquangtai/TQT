import React from 'react';

import { makeStyles, List, Typography, Button, Grid } from '@material-ui/core';
import CachedIcon from '@material-ui/icons/Cached';

import NavItem from './../NavItem';
import NavCollapse from './../NavCollapse';
import { useSelector } from 'react-redux';
import useFolder from '../../../../../hooks/useFolder';

const useStyles = makeStyles((theme) => ({
  menuCaption: {
    ...theme.typography.menuCaption,
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
  },
  menuIIcon: {
    fontSize: '1.5rem',
    color: '#3366FF',
  },
  menuIconMini: {
    width: '100%',
    '& button': {
      paddingLeft: '16px',
      paddingRight: '100%',
      minWidth: 'unset !important',
    },
  },
}));

const NavGroup = (props) => {
  const { item, drawerToggle, drawerOpen } = props;
  const classes = useStyles();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedApp } = useSelector((state) => state.app);
  const { reloadFolders } = useFolder();

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

  return (
    <List
      subheader={
        <Grid container justifyContent="space-between">
          {drawerOpen && (
            <Grid item>
              <Typography variant="caption" className={classes.menuCaption} display="block" gutterBottom>
                {item.title}
                {item.caption && (
                  <Typography variant="caption" className={classes.subMenuCaption} display="block" gutterBottom>
                    {item.caption}
                  </Typography>
                )}
              </Typography>
            </Grid>
          )}
          <Grid item className={`${drawerOpen ? '' : classes.menuIconMini}`}>
            {item.action === 'reload' && (
              <Button onClick={() => reloadFolders(selectedProject || '', selectedApp?.id || '')}>
                <CachedIcon className={`${classes.menuIIcon}`} />
              </Button>
            )}
          </Grid>
        </Grid>
      }
    >
      {items}
    </List>
  );
};

export default NavGroup;
