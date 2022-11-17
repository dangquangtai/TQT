import React from 'react';
import ReactECharts from "echarts-for-react";
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Typography,
} from '@material-ui/core';

const EHoritionalBarChart = ({ xAxis, series ,title}) => {

  const option = {
    textStyle: {
      fontFamily: 'Oswald'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
  
       
      }
    ],
    yAxis: [
      {
        type: 'category',
        data: xAxis,
         axisTick: {
          alignWithLabel: true
        }
      }
    ],
    series: series
   
};

  const iconBooking = (<Typography t="div" className="card-header">
    {title}
  </Typography>)

  return (
    <Card>
      <CardHeader
        title={
          iconBooking
        }
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ReactECharts option={option} />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default EHoritionalBarChart;
