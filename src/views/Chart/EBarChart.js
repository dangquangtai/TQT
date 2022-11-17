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

const CareerChart = ({ name,  series }) => {

  const  option = {
        title: {
          text: name,
        //   subtext: 'Fake Data',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'right'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: series,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

  const iconBooking = (<Typography t="div" className="card-header">
    Career
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
export default CareerChart;
