import React from 'react';
import { ShareService } from '../../services/api/Share/index.js';
import { format } from 'date-fns';
import { Grid, makeStyles } from '@material-ui/core';
import {
  Pagination,
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

  const [page, setPage] = React.useState(1);
  const [totalPage, setTotalPage] = React.useState(0);

  const handleChange = (event, value) => {
    setPage(value);
  };

  React.useEffect(() => {
    const getLogs = async () => {
      const { list, total_page } = await ShareService.getActivityLog({ id, page });
      setLogs(list);
      setTotalPage(total_page);
    };
    getLogs();
  }, [id, page]);

  return (
    <Grid container direction="column">
      <Timeline align="left" className={classes.timeline}>
        {logs?.map((item, i) => (
          <TimelineItem key={i}>
            <TimelineOppositeContent>
              <Typography color="textSecondary">
                {format(new Date(item.log_date), "dd/MM/yyyy 'lúc' h:mm aa")}
                <br />
                {item.email_address}
              </Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography dangerouslySetInnerHTML={{ __html: item.log_data }}></Typography>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <Pagination count={totalPage} page={page} onChange={handleChange} color="primary" />
    </Grid>
  );
};

export default ActivityLog;
