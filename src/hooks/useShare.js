import { useContext } from 'react';
import ShareContext from '../contexts/ShareContext';
const useShare = () => useContext(ShareContext);

export default useShare;