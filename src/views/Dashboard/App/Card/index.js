import React from 'react';
import {
  makeStyles,
  Card,
  CardContent,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import { SELECTED_APP_CHANGE, PROJECT_SELECTED, PROJECT_CHANGE } from './../../../../store/actions';
import { NavLink } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  img: {
    width: '24px',
    height: '24px',
    objectFit: 'contain',
  },
  h4: {
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '1.1rem',
  },
}));

const defaultImage =
  'https://firebasestorage.googleapis.com/v0/b/tqtapp-873d6.appspot.com/o/Icon%2Fsetting.png?alt=media&token=d3717224-a809-4347-8ff4-67d242be6835';

const AppCard = ({ app }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { app_name, description, projects: projectList } = app;

  const handleAppClick = () => {
    dispatch({ type: SELECTED_APP_CHANGE, app });
  };

  const handleProjectClick = async (project) => {
    dispatch({ type: SELECTED_APP_CHANGE, app });
    const newProjectList = projectList.map((item) => {
      return {
        ...item,
        selected: item.id === project.id ? true : false,
      };
    });
    console.log('newProjectList', newProjectList);
    dispatch({ type: PROJECT_CHANGE, projects: newProjectList });
  };

  return (
    <Card>
      <CardContent>
        <Grid container alignItems="center">
          <Grid item xs zeroMinWidth>
            <Typography align="left" className={classes.h4}>
              {app_name}
            </Typography>
            <Typography align="left" variant="subtitle2" color="inherit">
              {description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <List component="nav">
        {projectList?.map((project, index) => (
          <React.Fragment key={index}>
            <ListItem button component={NavLink} to="/dashboard/default" onClick={() => handleProjectClick(project)}>
              <ListItemAvatar>
                <Avatar style={{ backgroundColor: '#F2F2F2' }}>
                  <img src={project.icon || defaultImage} alt="icon" className={classes.img} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="h6">{project.project_name}</Typography>}
                secondary={project.project_description}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </Card>
  );
};

export default AppCard;
