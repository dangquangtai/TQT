import React, { createContext } from 'react';
import { apiEndpoints } from '../store/constant';
import axiosInstance from '../services/axios';

const ChartContext = createContext({});

export const ChartProvider = ({ children }) => {
  const getBarChartData = async (date) => {
    return axiosInstance.post(apiEndpoints.get_booking_data_by_career, { outputtype: 'RawJson', ...date }).then((response) => {
      if (response.status === 200 && response.data.return === 200) {
        const { data } = response.data;
        return data;
      } else return {};
    });
  };

  const getBookingDataByStatus = async (date) => {
    return axiosInstance
      .post(apiEndpoints.get_booking_data_by_career, { outputtype: 'RawJson', ...date })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response.data;
          return data;
        } else return {};
      });
  };
  const getBookingDataByMentor = async (date) => {
    return axiosInstance
      .post(apiEndpoints.get_booking_data_by_career, { outputtype: 'RawJson', ...date  })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response.data;
          return data;
        } else return {};
      });
  };
  const getBookingDataByCareer = async (date) => {
    return axiosInstance
      .post(apiEndpoints.get_booking_data_by_career, { outputtype: 'RawJson', ...date  })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const  data = response.data;
          return data;
        } else return {};
      });
  };
  const getBookingDataByRatting = async (date) => {
    return axiosInstance
      .post(apiEndpoints.get_mentor_ratting_colorfull_bar_chart, { outputtype: 'RawJson', ...date  })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response.data;
          return data;
        } else return {};
      });
  };
  const getLineChartData = async (date) => {
    return axiosInstance
      .post(apiEndpoints.get_line_chart_data, { outputtype: 'RawJson', ...date  })
      .then((response) => {
        if (response.status === 200 && response.data.return === 200) {
          const { data } = response.data;
          return data;
        } else return {};
      });
  };

  

  return (
    <ChartContext.Provider
      value={{
        getBarChartData,
        getBookingDataByStatus,
        getBookingDataByMentor,
        getBookingDataByCareer,
        getBookingDataByRatting,
        getLineChartData,
      }}
    >
      {children}
    </ChartContext.Provider>
  );
};

export default ChartContext;
