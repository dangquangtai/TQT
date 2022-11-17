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

const EClolorfullBarChart = ({ xAxis, series,title }) => {

  const option = {
    tooltip: { extraCssText: "width:1000; white-space:pre-wrap;" },
    xAxis: {
      type: 'category',
      data: 
      ["1", "2", "3", "4", "5", "Không\nđánh giá"]
    },
    yAxis: {
      type: 'value'
    },
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
export default EClolorfullBarChart;
