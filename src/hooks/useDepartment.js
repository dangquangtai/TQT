import { useContext } from 'react';
import DepartmentContext from '../contexts/DepartmentContext';
const useDepartment = () => useContext(DepartmentContext);

export default useDepartment;
