import React from 'react';
import {
  makeStyles,
  Button,
  Chip,
  ClickAwayListener,
  Fade,
  Grid,
  Paper,
  Popper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  ListItemSecondaryAction,
  Typography,
} from '@material-ui/core';
import { useDispatch } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import NotificationsNoneTwoToneIcon from '@material-ui/icons/NotificationsNoneTwoTone';
import { subHours } from 'date-fns';
import QueryBuilderTwoToneIcon from '@material-ui/icons/QueryBuilderTwoTone';
import AssignmentIndIcon from '@material-ui/icons/AssignmentInd';
import useAccount from '../../../../hooks/useAccount';
const useStyles = makeStyles((theme) => ({
  grow: {
    flex: 1,
  },
  root: {
    width: '100%',
    maxWidth: '300px',
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 0,
    borderRadius: '10px',
    [theme.breakpoints.down('lg')]: {
      minWidth: '300px',
      maxHeight: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      maxWidth: '300px',
      minWidth: '300px',
      maxHeight: '700px',
    },
  },
  popper: {
    [theme.breakpoints.down('xs')]: {
      left: '0',
      right: '0',
      top: '55px !important',
      marginLeft: 'auto',
      marginRight: 'auto',
      width: '50%',
      transform: 'none !important',
    },
  },
  inline: {
    display: 'inline',
  },
  paper: {
    marginRight: theme.spacing(2),
  },
  subHeader: {
    backgroundColor: theme.palette.grey.A400,
    color: theme.palette.common.white,
    padding: '5px 15px',
  },
  subFooter: {
    backgroundColor: theme.palette.grey.A400,
    color: theme.palette.common.white,
    padding: 0,
  },
  iconButton: {
    padding: '5px',
  },
  showIcon: {
    transform: 'rotate(90deg)',
  },
  listSection: {
    backgroundColor: 'inherit',
    display: 'block',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  listAction: {
    top: '22px',
  },
  actionIcon: {
    fontSize: '0.75rem',
    marginRight: '4px',
    color: theme.palette.grey[400],
  },
  actionColor: {
    color: theme.palette.grey[400],
  },
  ScrollHeight: {
    height: '500px',
    overflowX: 'hidden',
    [theme.breakpoints.down('lg')]: {
      // minWidth: '500px',
    },
    [theme.breakpoints.down('xs')]: {
      height: '700px',
    },
  },
  p0: {
    padding: 0,
  },
  pT0: {
    paddingTop: 0,
  },
  menuIIcon: {
    fontSize: '1.5rem',
  },
  menuButton: {
    [theme.breakpoints.down('sm')]: {
      minWidth: '50px',
    },
    [theme.breakpoints.down('xs')]: {
      minWidth: '35px',
    },
  },
}));

const NotificationSection = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const dateToday = new Date().getDate();
  const [taskList, setTask] = React.useState([]);
  const [currentlyTasks, setCurrentTask] = React.useState([]);
  const [laterTasks, setLateTask] = React.useState([]);
  const { getAllTask } = useAccount();
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
    // getTask();
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);
  React.useEffect(() => {
    // const fetch = async () => {
    //   try {
    //     let data = await getAllTask();
    //     setTask(data);
    //   } catch {
    //     let data = await getAllTask();
    //     setTask(data);
    //   }
    // };
    // fetch();
  }, []);
  React.useEffect(() => {
    setCurrentTask(taskList);
  }, taskList);
  return (
    <React.Fragment>
      <Button className={classes.menuButton} color="inherit">
        <NotificationsNoneTwoToneIcon className={classes.menuIIcon} />
      </Button>
      <Button
        className={classes.menuButton}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        color="inherit"
      >
        <AssignmentIndIcon></AssignmentIndIcon>
        {taskList?.length > 0 && (
          <span>
            <sup
              style={{
                backgroundColor: 'red',
                padding: '3px',
                borderTopRightRadius: '5px',
                borderBottomRightRadius: '5px',
                borderStartStartRadius: '10px',
                borderEndEndRadius: '5px',
              }}
            >
              {taskList?.length}
            </sup>
          </span>
        )}
      </Button>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        className={classes.popper}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: {
            offset: {
              enable: true,
              offset: '0px, 10px',
            },
            preventOverflow: {
              padding: 0,
            },
          },
        }}
      >
        {({ TransitionProps, placement }) => (
          <Fade {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <List className={classes.root}>
                  <PerfectScrollbar className={classes.ScrollHeight}>
                    {taskList.map(({ assigned_date, customer_name, task_title }, index) => (
                      <ListItem button alignItems="flex-start" className={classes.pT0} key={index}>
                        <ListItemAvatar>
                          <AssignmentIndIcon
                            style={{
                              fontSize: '40px',
                            }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1">
                              {task_title.length > 50 ? task_title.substring(0, 50) + '...' : task_title}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="subtitle2">
                              {customer_name} Ngày {assigned_date}
                            </Typography>
                          }
                        />
                        <ListItemSecondaryAction className={classes.listAction}>
                          <Grid container justifyContent="flex-end">
                            <Grid item>
                              <QueryBuilderTwoToneIcon className={classes.actionIcon} />
                            </Grid>
                            <Grid item>
                              <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}></Typography>
                            </Grid>
                          </Grid>
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                    {/* {laterTasks.length > 0 && (
                      <ListSubheader disableSticky>
                        <Chip size="small" variant="outlined" label="EARLIER" />
                      </ListSubheader>
                    )} */}
                    {/* {laterTasks.map(
                      (
                        {
                          assigned_date,
                       
                          customer_name,
                        
                          task_url,
                        },
                        index
                      ) => (
                        <ListItem button alignItems="flex-start" className={classes.pT0} key={index}>
                          <ListItemAvatar>
                            <AssignmentIndIcon
                              style={{
                                fontSize: '40px',
                              }}
                            />
                          </ListItemAvatar>
                          <ListItemText
                            primary={<Typography variant="subtitle1">{task_url}</Typography>}
                            secondary={
                              <Typography variant="subtitle2">
                                {customer_name} Ngày {assigned_date}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction className={classes.listAction}>
                            <Grid container justifyContent="flex-end">
                              <Grid item></Grid>
                              <Grid item>
                                <Typography variant="caption" display="block" gutterBottom className={classes.actionColor}></Typography>
                              </Grid>
                            </Grid>
                          </ListItemSecondaryAction>
                        </ListItem>
                      )
                    )} */}
                  </PerfectScrollbar>
                </List>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default NotificationSection;
