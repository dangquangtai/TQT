import { useContext } from 'react';
import RoleContext from '../contexts/RoleContext';
const useRole = () => useContext(RoleContext);

export default useRole;
