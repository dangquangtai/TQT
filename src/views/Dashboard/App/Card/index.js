import React from 'react';
import {
  makeStyles,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  ListItemAvatar,
  Avatar,
} from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import MailTwoToneIcon from '@material-ui/icons/MailTwoTone';

const useStyles = makeStyles((theme) => ({}));

const AppCard = (props) => {
  const { title, description, icon } = props;

  const Icon = (
    <SvgIcon>
      <g dangerouslySetInnerHTML={{ __html: icon }} />
    </SvgIcon>
  );

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* <Grid item></Grid> */}
          <Grid item xs zeroMinWidth>
            <Typography align="left" variant="h5">
              {title}
            </Typography>
            <Typography align="left" variant="subtitle2" color="inherit">
              {description}
            </Typography>
          </Grid>
          <Grid item>
            <Chip size="small" label="Pro" color="primary" />
          </Grid>
        </Grid>
      </CardContent>
      <Divider />
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemAvatar>
            <Avatar style={{ backgroundColor: '#F2F2F2' }}>
              <MailTwoToneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h6">Danh sách công việc</Typography>}
            secondary="Theo dõi các công việc đã bàn giao cho nhân viên."
          />
        </ListItem>
        <Divider />
        <ListItem button>
          <ListItemAvatar>
            <Avatar>
              <MailTwoToneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={<Typography variant="h6">Danh sách công việc</Typography>}
            secondary="Theo dõi các công việc đã bàn giao cho nhân viên."
          />
        </ListItem>
      </List>
    </Card>
  );
};

export default AppCard;
