import { useContext } from 'react';
import ChartContext from '../contexts/ChartContext.js';
const useChart = () => useContext(ChartContext);

export default useChart;