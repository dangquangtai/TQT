import { useContext } from 'react';
import ProcessRoleContext from '../contexts/ProcessRoleContext';
const useProcessRole = () => useContext(ProcessRoleContext);

export default useProcessRole;
