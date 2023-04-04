import React from 'react';
import { ShareService } from '../../services/api/Share/index.js';
import { format } from 'date-fns';
import { makeStyles } from '@material-ui/core';
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@material-ui/lab';
import { Typography } from '@mui/material';

export const useStyles = makeStyles((theme) => ({
  timeline: {
    padding: 0,
    margin: 0,
    '& .MuiTimelineOppositeContent-root': {
      flex: 'inherit',
    },
  },
}));

const ActivityLog = ({ id }) => {
  const classes = useStyles();
  const [logs, setLogs] = React.useState([]);

  React.useEffect(() => {
    const getLogs = async () => {
      const response = await ShareService.getActivityLog(id);
      setLogs(response);
    };
    getLogs();
  }, [id]);

  return (
    <React.Fragment>
      <Timeline align="left" className={classes.timeline}>
        {logs?.map((item, i) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent>
              <Typography color="textSecondary">{format(new Date(item.log_date), "dd/MM/yyyy 'lúc' h:mm aa")}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography>
                <div dangerouslySetInnerHTML={{ __html: item.log_content }} />
              </Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </React.Fragment>
  );
};

export default ActivityLog;
