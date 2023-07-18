import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import ContractTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';

const ContractWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);

  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'contract' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [dispatch, selectedProject]);

  return (
    <React.Fragment>
      <ContractTable tableTitle="Hợp đồng mua vật tư" url={getUrlByAction(selectedFolder)} documentType="contract" />
    </React.Fragment>
  );
};

export default ContractWrapper;
