import { useContext } from 'react';
import TaskContext from '../contexts/TaskContext';
const useTask = () => useContext(TaskContext);

export default useTask;
