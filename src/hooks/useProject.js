import { useContext } from 'react';
import ProjectContext from '../contexts/ProjectContext';
const useProject = () => useContext(ProjectContext);

export default useProject;
