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

const LineChart = ({ xAxis, legend, series }) => {

  const option = {
    title: {
      text: 'Stacked Line'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: legend
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxis
    },
    yAxis: {
      type: 'value'
    },
    series: series
  };

  const iconBooking = (<Typography t="div" className="card-header">
    Booking
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
export default LineChart;
