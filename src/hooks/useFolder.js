import { useContext } from 'react';
import FolderContext from '../contexts/FolderContext';
const useFolder = () => useContext(FolderContext);

export default useFolder;
