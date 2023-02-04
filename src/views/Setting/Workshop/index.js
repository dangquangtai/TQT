import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DOCUMENT_CHANGE } from '../../../store/actions.js';
import { apiEndpoints } from '../../../store/constant.js';
import WorkshopTable from '../../Table';
import { getUrlByAction } from './../../../utils/utils';
const WorkshopWrapper = () => {
  const dispatch = useDispatch();

  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const { selectedFolder } = useSelector((state) => state.folder);
  useEffect(() => {
    function fetchData() {
      dispatch({ type: DOCUMENT_CHANGE, documentType: 'workshop' });
    }
    if (selectedProject) {
      fetchData();
    }
  }, [selectedProject]);

  return (
    <React.Fragment>
      <WorkshopTable
        tableTitle="Quản lý Xưởng sản xuất"
        url={getUrlByAction(selectedFolder)}
        documentType="workshop"
        setActiveUrl={apiEndpoints.active_workshop}
      />
    </React.Fragment>
  );
};

export default WorkshopWrapper;
