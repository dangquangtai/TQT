import { useContext } from 'react';
import ViewContext from '../contexts/ViewContext';
const useView = () => useContext(ViewContext);

export default useView;
