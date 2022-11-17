import { useContext } from 'react';
import ConfirmPopupContext from '../contexts/ConfirmPopupContext';
const useConfirmPopup = () => useContext(ConfirmPopupContext);

export default useConfirmPopup;
