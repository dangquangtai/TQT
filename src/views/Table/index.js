import {
  Button,
  Card,
  Checkbox,
  Grid,
  Tooltip,
  FormControlLabel,
  TablePagination,
  TableRow,
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Chip,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CONFIRM_CHANGE, DOCUMENT_CHANGE, FLOATING_MENU_CHANGE, TASK_CHANGE } from '../../store/actions';
import { gridSpacing, view } from '../../store/constant';
import EnhancedTableHead from './EnhancedTableHead';
import EnhancedTableToolbar from './EnhancedTableToolbar';
import TreeViewModal from '../Department/Tree_View';
import { style, useStyles } from './style';
import { getComparator, stableSort } from '../../utils/table';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { format as formatDate } from 'date-fns';
import axiosInstance from '../../services/axios';
import ProcessRoleDeptModal from './../ProcessRole/DepartmentRole/index';
import useTask from './../../hooks/useTask';
import useView from './../../hooks/useView';
import useAccount from '../../hooks/useAccount';
import useDepartment from '../../hooks/useDepartment';
import useConfirmPopup from './../../hooks/useConfirmPopup';
import useProcessRole from './../../hooks/useProcessRole';
import useRole from '../../hooks/useRole';
import { getDetailMaterialCategory } from '../../services/api/Setting/MaterialCategory';
import { getDetailSupplierCategory } from './../../services/api/Setting/SupplierCategory';
import { getDetailProductCategory } from './../../services/api/Setting/ProductCategory';
import { getDetailCustomerCategory } from './../../services/api/Setting/CustomerCategory';
import { getDetailProduct } from './../../services/api/Product/Product';
import { getDetailOrder } from './../../services/api/Order/index';
import { getDetailWorkorOrder } from './../../services/api/Workorder/index';
import { getDetailCustomer } from '../../services/api/Partner/Customer.js';
import { getDetailSupplier } from './../../services/api/Partner/Supplier';
import { getDetailWarehouseCategory } from './../../services/api/Setting/WHSCategory';
import { getDetailInventory } from './../../services/api/Material/Inventory';
import { getDetailInventoryCheck } from './../../services/api/Material/InventoryCheck';
async function setFeatured(setFeaturedUrl, documentId, isFeatured) {
  return await axiosInstance
    .post(setFeaturedUrl, { outputtype: 'RawJson', id: documentId, value: isFeatured })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      else return false;
    });
}

async function setActive(setActiveUrl, documentId, isActive) {
  return await axiosInstance
    .post(setActiveUrl, { outputtype: 'RawJson', id: documentId, value: isActive })
    .then((response) => {
      if (response.status === 200 && response.data.return === 200) return true;
      else return false;
    });
}

export default function GeneralTable(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { setConfirmPopup } = useConfirmPopup();
  const { setView, menu_buttons: menuButtons, columns: tableColumns } = useView();
  const [displayOptions, setDisplayOptions] = React.useState({});
  const { selectedFolder } = useSelector((state) => state.folder);
  const { selectedDocument } = useSelector((state) => state.document);

  useEffect(() => {
    const initOptions = {
      id: tableColumns.includes('id'),
      image_url: tableColumns.includes('image_url'),
      title: tableColumns.includes('title'),
      part_code: tableColumns.includes('part_code'),
      product_code: tableColumns.includes('product_code'),
      category_name: tableColumns.includes('category_name'),
      product_customer_code: tableColumns.includes('product_customer_code'),
      no_piece_per_box: tableColumns.includes('piece'),
      productivity_per_worker: tableColumns.includes('productivity'),
      fullname: tableColumns.includes('fullname'),
      email_address: tableColumns.includes('email_address'),
      number_phone: tableColumns.includes('number_phone'),
      created_date: tableColumns.includes('created_date'),
      created_by: tableColumns.includes('created_by'),
      account_id: tableColumns.includes('account_id'),
      department_name: tableColumns.includes('department_name'),
      department_parent: tableColumns.includes('department_parent'),
      number_member: tableColumns.includes('number_member'),
      role_template_name: tableColumns.includes('role_template_name'),
      apply_to_department_type: tableColumns.includes('apply_to_department_type'),
      approval_role: tableColumns.includes('approval_role'),
      visible_for_selection: tableColumns.includes('visible_for_selection'),
      active: tableColumns.includes('active'),
      full_name: tableColumns.includes('full_name'),
      menuButtons: !!menuButtons.length || false,
      is_featured: tableColumns.includes('is_featured'),
      is_active: tableColumns.includes('is_active'),
      customer_name: tableColumns.includes('customer_name'),
      order_date: tableColumns.includes('order_date'),
      order__title: tableColumns.includes('order__title'),
      from__date: tableColumns.includes('from__date'),
      to__date: tableColumns.includes('to__date'),
      status__display: tableColumns.includes('status__display'),
      expected_deliver_date: tableColumns.includes('expected_deliver_date'),
      customer_code: tableColumns.includes('customer_code'),
      supplier_code: tableColumns.includes('supplier_code'),
      is_part_list_available: tableColumns.includes('is_part_list_available'),
      part_name: tableColumns.includes('part_name'),
      product_name: tableColumns.includes('product_name'),
      supplier_name: tableColumns.includes('supplier_name'),
      quantity_in_piece: tableColumns.includes('quantity_in_piece'),
      broken_quantity_in_piece: tableColumns.includes('broken_quantity_in_piece'),
      quantity_in_box: tableColumns.includes('quantity_in_box'),
      inventory_check_code: tableColumns.includes('inventory_check_code'),
      inventory_check_date: tableColumns.includes('inventory_check_date'),
    };
    setDisplayOptions(initOptions);
  }, [tableColumns, selectedFolder]);

  const buttonAccountCreate = menuButtons.find((button) => button.name === view.user.list.create);

  const buttonDeptCreate = menuButtons.find((button) => button.name === view.department.list.create);
  const buttonDeptUpdate = menuButtons.find((button) => button.name === view.department.list.update);
  const buttonDeptAddUser = menuButtons.find((button) => button.name === view.department.list.adduser);
  const buttonDeptRemoveUser = menuButtons.find((button) => button.name === view.department.list.removeaccount);
  const buttonSyncDepartment = menuButtons.find((button) => button.name === view.department.list.syncDept);
  const buttondeactiveDepartment = menuButtons.find((button) => button.name === view.department.list.deactive);

  const buttonCreateRole = menuButtons.find((button) => button.name === view.role.list.create);

  const buttonCreateProcessRole = menuButtons.find((button) => button.name === view.processrole.list.create);
  const buttonUpdateProcessRole = menuButtons.find((button) => button.name === view.processrole.list.update);
  const buttonUpdateDeptRole = menuButtons.find((button) => button.name === view.processrole.list.update_dept_role);
  const buttonRemoveDeptRole = menuButtons.find((button) => button.name === view.processrole.list.removedept);
  const buttonRemoveAccountRole = menuButtons.find((button) => button.name === view.processrole.list.removeaccount);
  const buttonAddDeptRole = menuButtons.find((button) => button.name === view.processrole.list.adddept);
  const buttonAddAccountRole = menuButtons.find((button) => button.name === view.processrole.list.adduser);
  const buttonSyncRole = menuButtons.find((button) => button.name === view.processrole.list.syncRole);

  const buttonCreateMaterialCategory = menuButtons.find((button) => button.name === view.materialCategory.list.create);
  const buttonCreateSupplierCategory = menuButtons.find((button) => button.name === view.supplierCategory.list.create);
  const buttonCreateProductCategory = menuButtons.find((button) => button.name === view.productCategory.list.create);
  const buttonCreateCustomerCategory = menuButtons.find((button) => button.name === view.customerCategory.list.create);
  const buttonCreateWarehouseCategory = menuButtons.find(
    (button) => button.name === view.warehouseCategory.list.create
  );
  const buttonCreateOrder = menuButtons.find((button) => button.name === view.order.list.create);
  const buttonCreateWorkorder = menuButtons.find((button) => button.name === view.workorder.list.create);

  const buttonCreateCustomer = menuButtons.find((button) => button.name === view.customer.list.create);
  const buttonCreateSupplier = menuButtons.find((button) => button.name === view.supplier.list.create);
  const buttonCreateInventoryCheck = menuButtons.find(
    (button) => button.name === view.materialInventoryCheck.list.create
  );

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const { url, documentType, categories, tableTitle, setFeaturedUrl, setActiveUrl } = props;
  const [pageCurrent, setPage] = React.useState(1);
  const { projects } = useSelector((state) => state.project);
  const selectedProject = projects.find((project) => project.selected);
  const [roletemplateList, setRoleList] = React.useState([]);
  const [userList, setUserList] = React.useState([]);
  const [deptList, setDeptList] = React.useState([]);
  const reduxDocuments = useSelector((state) => state.task);
  const [changeDeptReload, ReloadDept] = React.useState(0);
  const { getProcessDetail, addDeptUser, removeUser, removeDept, syncProcessRole } = useProcessRole();

  const {
    documents = [],
    total_item: count = 0,
    page = 1,
    order_by = '',
    order_type = 'desc',
    no_item_per_page = 10,
    category_id = '',
    search_text = '',
    folder_id,
    project_id,
    from_date = '',
    to_date = '',
  } = reduxDocuments[documentType] || {};
  const [department_code_selected, setSelectedDepartment] = React.useState('');
  const [role_template_selected, setSelectedRoleTemplate] = React.useState('Member');
  const [process_role_code_selected, setSelectedProcessRole] = React.useState('');
  const defaultQueries = {
    page: 1,
    order_by,
    order_type,
    no_item_per_page,
    category_id,
    search_text: '',
    department_code: department_code_selected,
    role_template_code: role_template_selected,
    process_role_code: process_role_code_selected,
  };

  const { getDocuments } = useTask();

  const { activeDepartment, getDepartmentDetail, getAllDepartment } = useDepartment();

  const { activeRole, getRoleDetail, getDepartmentListGroup, syncRole, getRoletemplateByDept } = useRole();

  const { getAccountDetail, activeAccount, assignAccount, removeAccount, getAllUser } = useAccount();

  useEffect(() => {
    if (selectedProject && selectedFolder && url) {
      fetchDocument(url, documentType, selectedProject.id, selectedFolder.id);
    } else {
      dispatch({
        type: TASK_CHANGE,
        documentType,
        documents: [],
        total_item: count,
        page,
        order_by,
        order_type,
        no_item_per_page,
        search_text,
        category_id,
        folder_id,
        project_id,
        from_date,
        to_date,
      });
    }
  }, [selectedFolder]);

  useEffect(() => {
    if (documentType === 'department' && department_code_selected !== '') {
      const fetchRoleList = async () => {
        let data = await getRoletemplateByDept(department_code_selected);
        setRoleList(data);
      };

      fetchRoleList();
      reloadCurrentDocuments();
    }
  }, [department_code_selected]);

  useEffect(() => {
    if (documentType === 'department') {
      const fetchUserList = async () => {
        let data = await getAllUser();
        setUserList(data);
        data = await getAllDepartment();
        setDeptList(data);
      };
      fetchUserList();
    }
  }, []);

  useEffect(() => {
    if (selectedDocument === null && documents.length > 0) {
      reloadCurrentDocuments(page);
    }
    if (changeDeptReload === 0) {
      ReloadDept(1);
    } else {
      ReloadDept(0);
    }
  }, [selectedDocument, process_role_code_selected]);

  const fetchDocument = (additionalQuery) => {
    const queries = { ...defaultQueries, ...additionalQuery };
    getDocuments(url, documentType, selectedProject?.id, selectedFolder?.id, queries);
  };

  const handleAssignAccount = async (user) => {
    if (!!user && !!department_code_selected && role_template_selected) {
      await assignAccount({
        email_address: user.email_address,
        department_code: department_code_selected,
        role_template_code: role_template_selected,
      });
      reloadCurrentDocuments();
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn phòng ban, chức vụ, tài khoản trước khi thao tác',
        action: null,
        payload: null,
        onSuccess: clickSuccess,
      });
    }
  };
  const handleAddDeptUser = async (email_address, department_code) => {
    await addDeptUser(process_role_code_selected, department_code, email_address);
    reloadCurrentDocuments();
  };

  const handleRemoveAccount = async (email) => {
    await removeAccount({
      email_address: email,
      department_code: department_code_selected,
      role_template_code: role_template_selected,
    });
    reloadCurrentDocuments();
  };

  const handleRequestSort = (event, property) => {
    const isAsc = order_by === property && order_type === 'asc';
    fetchDocument(url, documentType, project_id, folder_id, {
      page: 1,
      order_by: property,
      order_type: isAsc ? 'desc' : 'asc',
      no_item_per_page,
      category_id,
      search_text,
      department_code: department_code_selected,
      role_template_code: role_template_selected,
      process_role_code: process_role_code_selected,
    });
    setPage(1);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = documents.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    let page = newPage + 1;
    fetchDocument({ page: page, search_text, category_id });
    setPage(page);
  };

  const handleChangeRowsPerPage = (event) => {
    fetchDocument({ page: 1, no_item_per_page: event.target.value, search_text, category_id });
    setPage(1);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const openDetailDocument = async (event, selectedDocument) => {
    event.stopPropagation();
    let detailDocument = null;
    switch (documentType) {
      case 'account':
        detailDocument = await getAccountDetail(selectedDocument.id);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: true });
        break;
      case 'role':
        detailDocument = await getRoleDetail(selectedDocument.role_template_id);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
        break;
      case 'departmentList':
        detailDocument = await getDepartmentDetail(selectedDocument.department_code);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
        break;
      case 'materialCategory':
        detailDocument = await getDetailMaterialCategory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'supplierCategory':
        detailDocument = await getDetailSupplierCategory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'productCategory':
        detailDocument = await getDetailProductCategory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'customerCategory':
        detailDocument = await getDetailCustomerCategory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'warehouseCategory':
        detailDocument = await getDetailWarehouseCategory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'product':
        detailDocument = await getDetailProduct(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, productDocument: true });
        break;
      case 'order':
        detailDocument = await getDetailOrder(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, orderDocument: true });
        break;
      case 'workorder':
        detailDocument = await getDetailWorkorOrder(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
        break;
      case 'customer':
        detailDocument = await getDetailCustomer(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, customerDocument: true });
        break;
      case 'supplier':
        detailDocument = await getDetailSupplier(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, supplierDocument: true });
        break;
      case 'materialInventory':
        detailDocument = await getDetailInventory(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, materialInventoryDocument: true });
        break;
      case 'materialInventoryCheck':
        detailDocument = await getDetailInventoryCheck(selectedDocument.id, setView);
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, materialInventoryCheckDocument: true });
        break;
      default:
        break;
    }
  };

  const openDialogCreate = () => {
    dispatch({ type: DOCUMENT_CHANGE, documentType });
    switch (documentType) {
      case 'account':
        dispatch({ type: FLOATING_MENU_CHANGE, accountDocument: true });
        break;
      case 'workorder':
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
        break;
      case 'department':
        dispatch({ type: FLOATING_MENU_CHANGE, departmentDocument: true });
        break;
      case 'role':
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
        break;
      case 'materialCategory':
      case 'supplierCategory':
      case 'productCategory':
      case 'customerCategory':
      case 'warehouseCategory':
        dispatch({ type: FLOATING_MENU_CHANGE, categoryDocument: true });
        break;
      case 'order':
        dispatch({ type: FLOATING_MENU_CHANGE, orderDocument: true });
        break;
      case 'customer':
        dispatch({ type: FLOATING_MENU_CHANGE, customerDocument: true });
        break;
      case 'supplier':
        dispatch({ type: FLOATING_MENU_CHANGE, supplierDocument: true });
        break;
      case 'materialInventoryCheck':
        dispatch({ type: FLOATING_MENU_CHANGE, materialInventoryCheckDocument: true });
        break;
      default:
        break;
    }
  };

  const handleUpdateDepartment = async () => {
    if (department_code_selected !== '') {
      let detailDocument = await getDepartmentDetail(department_code_selected);
      dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, departmentDocument: true });
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn phòng ban trước khi thao tác',
        action: null,
        payload: null,
        onSuccess: clickSuccess,
      });
    }
  };

  const handleDeactiveDepartment = async () => {
    if (department_code_selected !== '') {
      await activeDepartment({ department_code: department_code_selected, is_active: false });
      setSelectedDepartment('');
      reloadCurrentDocuments();
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn phòng ban trước khi thao tác',
        action: null,
        payload: null,
        onSuccess: clickSuccess,
      });
    }
  };

  const reloadCurrentDocuments = (page = 1) => {
    setSelected([]);
    fetchDocument({ page: pageCurrent });
  };

  const showConfirmPopup = ({
    title = 'Thông báo',
    message = 'Yêu cầu lựa chọn ít nhất một bản ghi',
    action = null,
    payload = null,
    onSuccess = null,
  }) => {
    setConfirmPopup({ type: CONFIRM_CHANGE, open: true, title, message, action, payload, onSuccess });
  };

  const toggleSetActiveAccount = async (event, email_address, is_active) => {
    event.stopPropagation();
    await activeAccount({
      email_address: email_address,
      is_active: is_active,
    });
    reloadCurrentDocuments();
  };

  const toggleSetActiveRole = async (event, id, is_active) => {
    event.stopPropagation();
    await activeRole({
      id,
      is_active,
    });
    reloadCurrentDocuments();
  };

  const toggleSetDepartment = async (event, department_code, is_active) => {
    event.stopPropagation();
    await activeDepartment({
      department_code: department_code,
      is_active: is_active,
    });
    reloadCurrentDocuments();
  };

  const handleRemoveAccountToRole = async (email_address) => {
    try {
      await removeUser(process_role_code_selected, email_address);
      reloadCurrentDocuments();
    } catch (e) {
    } finally {
    }
  };

  const handleRemoveDeptToRole = async (department_code) => {
    try {
      await removeDept(process_role_code_selected, department_code);
      if (changeDeptReload === 0) {
        ReloadDept(1);
      } else {
        ReloadDept(0);
      }
    } catch (e) {
    } finally {
    }
  };

  const handleShowColumn = (id, newState) => {
    setDisplayOptions((pre) => ({ ...pre, [id]: newState }));
  };

  const [, setGroup] = React.useState();

  const handleFilterChange = (data) => {
    fetchDocument(data);
    setGroup(data.group_id);
  };

  const handleClickCreateProcessRole = () => {
    dispatch({ type: DOCUMENT_CHANGE, documentType });
    dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
  };

  const handleClickProcessRoleDetail = async () => {
    if (process_role_code_selected !== '') {
      let detailDocument = await getProcessDetail(process_role_code_selected);
      if (!detailDocument) {
        showConfirmPopup({
          title: 'Thông báo',
          message: 'Yêu cầu lựa chọn process role trước khi thực hiện thao tác',
          action: null,
          payload: null,
          onSuccess: clickSuccess,
        });
      } else {
        dispatch({ type: DOCUMENT_CHANGE, selectedDocument: detailDocument, documentType });
        dispatch({ type: FLOATING_MENU_CHANGE, detailDocument: true });
      }
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn process role trước khi thực hiện thao tác',
        action: null,
        payload: null,
        onSuccess: clickSuccess,
      });
    }
  };

  const handleClickUpdateUserProcessRole = () => {
    if (process_role_code_selected !== '') {
      dispatch({ type: DOCUMENT_CHANGE, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, processUserDocument: true, processrolecode: process_role_code_selected });
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn process role',
        action: null,
        payload: null,
        onSuccess: null,
      });
    }
  };

  const handleClickUpdateDeptProcessRole = () => {
    if (process_role_code_selected !== '') {
      dispatch({ type: DOCUMENT_CHANGE, documentType });
      dispatch({ type: FLOATING_MENU_CHANGE, processDeptDocument: true, processrolecode: process_role_code_selected });
    } else {
      showConfirmPopup({
        title: 'Thông báo',
        message: 'Yêu cầu lựa chọn process role',
        action: null,
        payload: null,
        onSuccess: null,
      });
    }
  };

  const toggleSetFeatured = async (event, document, isFeatured) => {
    event.stopPropagation();
    await setFeatured(setFeaturedUrl, document.id, isFeatured);
    fetchDocument();
  };

  const toggleSetActive = async (event, document, isActive) => {
    event.stopPropagation();
    await setActive(setActiveUrl, document.id, isActive);
    fetchDocument();
  };

  const handleSyncRole = async () => {
    showConfirmPopup({
      message: `Xác nhận đồng bộ ?`,
      action: syncRole,
      payload: null,
      onSuccess: reloadCurrentDocuments,
    });
  };

  const handleSyncProcessRole = async () => {
    showConfirmPopup({
      message: `Xác nhận đồng bộ ?`,
      action: syncProcessRole,
      payload: null,
      onSuccess: reloadCurrentDocuments,
    });
  };

  const clickSuccess = () => {};

  return (
    <React.Fragment>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12} style={style.tableTitleWrap}>
          <Grid item xs={6}>
            <div style={style.tableTitle}>{tableTitle}</div>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card className={classes.root}>
            <Paper className={classes.paper}>
              <EnhancedTableToolbar
                categories={categories}
                numSelected={selected.length}
                handleFilterChange={handleFilterChange}
                handleShowColumn={handleShowColumn}
                displayOptions={displayOptions}
                data={stableSort(documents || [], getComparator(order, orderBy))}
                btnCreateNewAccount={buttonAccountCreate}
                createNewAccount={openDialogCreate}
                handleSyncRole={handleSyncRole}
                handleAssignAccount={handleAssignAccount}
                btnCreateNewDept={buttonDeptCreate}
                buttonDeptUpdate={buttonDeptUpdate}
                buttondeactiveDepartment={buttondeactiveDepartment}
                buttonDeptAddUser={buttonDeptAddUser}
                roletemplateList={roletemplateList}
                userList={userList}
                deptList={deptList}
                createNewDept={openDialogCreate}
                buttonCreateWorkorder={buttonCreateWorkorder}
                createWorkorder={openDialogCreate}
                buttonCreateRole={buttonCreateRole}
                createNewRole={openDialogCreate}
                getDepartmentList={getDepartmentListGroup}
                buttonSyncDepartment={buttonSyncDepartment}
                handleUpdateDepartment={handleUpdateDepartment}
                handleDeactiveDepartment={handleDeactiveDepartment}
                syncRole={syncRole}
                department_code_selected={department_code_selected}
                setSelectedRoleTemplate={setSelectedRoleTemplate}
                buttonCreateProcessRole={buttonCreateProcessRole}
                createNewProcessRole={handleClickCreateProcessRole}
                buttonUpdateProcessRole={buttonUpdateProcessRole}
                buttonUpdateDeptRole={buttonUpdateDeptRole}
                setSelectedDepartment={setSelectedDepartment}
                handleClickProcessRoleDetail={handleClickProcessRoleDetail}
                handleAddDeptUser={handleAddDeptUser}
                handleClickUpdateUserProcessRole={handleClickUpdateUserProcessRole}
                handleClickUpdateDeptProcessRole={handleClickUpdateDeptProcessRole}
                buttonAddDeptRole={buttonAddDeptRole}
                buttonAddAccountRole={buttonAddAccountRole}
                buttonSyncRole={buttonSyncRole}
                handleSyncProcessRole={handleSyncProcessRole}
                handleCreate={openDialogCreate}
                buttonCreateMaterialCategory={buttonCreateMaterialCategory}
                buttonCreateSupplierCategory={buttonCreateSupplierCategory}
                buttonCreateProductCategory={buttonCreateProductCategory}
                buttonCreateCustomerCategory={buttonCreateCustomerCategory}
                buttonCreateOrder={buttonCreateOrder}
                buttonCreateCustomer={buttonCreateCustomer}
                buttonCreateSupplier={buttonCreateSupplier}
                buttonCreateWarehouseCategory={buttonCreateWarehouseCategory}
                buttonCreateInventoryCheck={buttonCreateInventoryCheck}
              />
              <Grid container spacing={gridSpacing}>
                {(documentType === 'department' || documentType === 'processrole') && (
                  <Grid item xs={4}>
                    <TreeViewModal
                      setSelectedDepartment={setSelectedDepartment}
                      setSelectedProcessRole={setSelectedProcessRole}
                      documents={documents}
                      documentType={documentType}
                    />
                  </Grid>
                )}
                {documentType === 'processrole' && (
                  <Grid item xs={4}>
                    <ProcessRoleDeptModal
                      process_role_code_selected={process_role_code_selected}
                      handleRemoveDept={handleRemoveDeptToRole}
                      buttonRemoveDeptRole={buttonRemoveDeptRole}
                      changeDeptReload={changeDeptReload}
                    />
                  </Grid>
                )}
                <Grid item xs={documentType === 'department' ? 8 : documentType === 'processrole' ? 4 : 12}>
                  <TableContainer>
                    <Table
                      stickyHeader
                      className={
                        documentType === 'department'
                          ? classes.table2
                          : documentType === 'processrole'
                          ? classes.table3
                          : classes.table
                      }
                      aria-labelledby="tableTitle"
                      size={'medium'}
                      // aria-label="enhanced table"
                    >
                      <EnhancedTableHead
                        classes={classes}
                        numSelected={selected.length}
                        order={order_type}
                        orderBy={order_by}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={documents?.length}
                        displayOptions={displayOptions}
                        documentType={documentType}
                      />
                      <TableBody>
                        {stableSort(documents || [], getComparator(order, orderBy)).map((row, index) => {
                          const isItemSelected = isSelected(row.id);
                          const labelId = `enhanced-table-checkbox-${index}`;
                          return (
                            <TableRow
                              className={classes.tableRow}
                              hover
                              aria-checked={isItemSelected}
                              tabIndex={-1}
                              key={row.id || row.account_id || row.department_code || row.role_template_id}
                              selected={isItemSelected}
                            >
                              {documentType !== 'department' && documentType !== 'processrole' && (
                                <TableCell padding="checkbox">
                                  <Checkbox
                                    onClick={(event) => handleClick(event, row.id)}
                                    checked={isItemSelected}
                                    inputProps={{ 'aria-labelledby': labelId }}
                                  />
                                </TableCell>
                              )}
                              {displayOptions.image_url && (
                                <TableCell align="left">
                                  <img alt="" src={row.image_url} style={style.tableUserAvatar} />
                                </TableCell>
                              )}

                              {displayOptions.fullname && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.fullname}
                                </TableCell>
                              )}
                              {displayOptions.part_code && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.part_code}
                                </TableCell>
                              )}
                              {displayOptions.product_code && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.product_code}
                                </TableCell>
                              )}
                              {displayOptions.customer_code && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.customer_code}
                                </TableCell>
                              )}
                              {displayOptions.supplier_code && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.supplier_code}
                                </TableCell>
                              )}
                              {displayOptions.inventory_check_code && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.inventory_check_code}
                                </TableCell>
                              )}
                              {displayOptions.title && (
                                <TableCell
                                  style={{ maxWidth: 450, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.title}
                                </TableCell>
                              )}
                              {displayOptions.part_name && (
                                <TableCell
                                  style={{ maxWidth: 450, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.part_name || row.title}
                                </TableCell>
                              )}
                              {displayOptions.product_name && (
                                <TableCell
                                  style={{ maxWidth: 450, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.product_name || row.title}
                                </TableCell>
                              )}
                              {displayOptions.customer_name && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.customer_name || row.title}
                                </TableCell>
                              )}
                              {displayOptions.supplier_name && (
                                <TableCell
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.supplier_name || row.title}
                                </TableCell>
                              )}
                              {displayOptions.category_name && (
                                <TableCell
                                  style={{ maxWidth: 450, overflow: 'hidden', textOverflow: 'ellipsis' }}
                                  align="left"
                                  onClick={(event) => openDetailDocument(event, row)}
                                  className={classes.tableItemName}
                                >
                                  {row.category_name}
                                </TableCell>
                              )}
                              {/* {displayOptions.customer_name && <TableCell align="left">{row.customer_name}</TableCell>} */}
                              {displayOptions.product_customer_code && (
                                <TableCell align="left">{row.product_customer_code}</TableCell>
                              )}
                              {displayOptions.no_piece_per_box && (
                                <TableCell align="left">{row.no_piece_per_box}</TableCell>
                              )}
                              {displayOptions.productivity_per_worker && (
                                <TableCell align="left">{row.productivity_per_worker}</TableCell>
                              )}
                              {displayOptions.order_date && (
                                <TableCell align="left">
                                  {row.order_date ? formatDate(new Date(row.order_date), 'dd/MM/yyyy') : ''}
                                </TableCell>
                              )}
                              {displayOptions.inventory_check_date && (
                                <TableCell align="left">
                                  {row.inventory_check_date
                                    ? formatDate(new Date(row.inventory_check_date), 'dd/MM/yyyy')
                                    : ''}
                                </TableCell>
                              )}
                              {displayOptions.expected_deliver_date && (
                                <TableCell align="left">
                                  {row.expected_deliver_date
                                    ? formatDate(new Date(row.expected_deliver_date), 'dd/MM/yyyy')
                                    : ''}
                                </TableCell>
                              )}
                              {displayOptions.account_id && (
                                <TableCell
                                  align="left"
                                  className={classes.tableItemName}
                                  onClick={(event) => openDetailDocument(event, row)}
                                >
                                  {row.account_id}
                                </TableCell>
                              )}
                              {displayOptions.department_name && (
                                <TableCell align="left">{row.department_name}</TableCell>
                              )}
                              {displayOptions.department_parent && (
                                <TableCell align="left">{row.parent_department_name}</TableCell>
                              )}
                              {displayOptions.number_member && <TableCell align="left">{row.number_member}</TableCell>}
                              {displayOptions.full_name && (
                                <TableCell
                                  align="left"
                                  className={classes.tableItemName}
                                  onClick={(event) => openDetailDocument(event, row)}
                                >
                                  {row.full_name}
                                </TableCell>
                              )}
                              {displayOptions.email_address && (
                                <TableCell align="left">{row.email_address || ''}</TableCell>
                              )}
                              {displayOptions.number_phone && (
                                <TableCell align="left">{row.number_phone || ''}</TableCell>
                              )}
                              {displayOptions.role_template_name && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.role_template_name}
                                </TableCell>
                              )}
                              {displayOptions.apply_to_department_type && row.apply_to_department_type && (
                                <TableCell align="left">{row.apply_to_department_type.join(', ')}</TableCell>
                              )}

                              {displayOptions.visible_for_selection && (
                                <TableCell align="left">
                                  <>
                                    <FormControlLabel
                                      control={<Switch color="primary" checked={row.is_approval_role} />}
                                    />
                                  </>
                                </TableCell>
                              )}
                              {displayOptions.is_part_list_available && (
                                <TableCell align="left">
                                  {row.is_part_list_available ? (
                                    <Chip label="Có" color="primary" />
                                  ) : (
                                    <Chip label="Không" color="secondary" />
                                  )}
                                </TableCell>
                              )}
                              {displayOptions.approval_role && (
                                <TableCell align="left">
                                  <>
                                    <FormControlLabel
                                      control={<Switch color="primary" checked={row.is_visible_for_selection} />}
                                    />
                                  </>
                                </TableCell>
                              )}
                              {displayOptions.amount && <TableCell align="left">{row.amount || ''}</TableCell>}
                              {displayOptions.quantity_in_piece && (
                                <TableCell align="left">{row.quantity_in_piece}</TableCell>
                              )}
                              {displayOptions.quantity_in_box && (
                                <TableCell align="left">{row.quantity_in_box}</TableCell>
                              )}
                              {displayOptions.broken_quantity_in_piece && (
                                <TableCell align="left">{row.broken_quantity_in_piece}</TableCell>
                              )}
                              {displayOptions.created_by && <TableCell align="left">{row.created_by || ''}</TableCell>}
                              {displayOptions.created_date && (
                                <TableCell align="left">
                                  {row.created_date ? formatDate(new Date(row.created_date), 'dd/MM/yyyy') : ''}
                                </TableCell>
                              )}
                              {displayOptions.order__title && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.order_title}{' '}
                                </TableCell>
                              )}
                              {displayOptions.from__date && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.from_date}
                                </TableCell>
                              )}
                              {displayOptions.to__date && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.to_date}
                                </TableCell>
                              )}
                              {displayOptions.status__display && (
                                <TableCell align="left" onClick={(event) => openDetailDocument(event, row)}>
                                  {row.status_display}
                                </TableCell>
                              )}
                              {displayOptions.is_active && (
                                <TableCell align="left">
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={row.is_active}
                                        onClick={(event) => toggleSetActive(event, row, event.target.checked)}
                                      />
                                    }
                                  />
                                </TableCell>
                              )}
                              {displayOptions.is_featured && (
                                <TableCell align="left">
                                  <FormControlLabel
                                    control={
                                      <Switch
                                        checked={row.is_featured}
                                        onClick={(event) => toggleSetFeatured(event, row, event.target.checked)}
                                      />
                                    }
                                  />
                                </TableCell>
                              )}
                              {displayOptions.active && (
                                <TableCell align="left">
                                  <>
                                    {(() => {
                                      // eslint-disable-next-line default-case
                                      switch (documentType) {
                                        case 'account':
                                          return (
                                            <FormControlLabel
                                              control={
                                                <Switch
                                                  color="primary"
                                                  checked={row.is_active}
                                                  onClick={(event) =>
                                                    toggleSetActiveAccount(
                                                      event,
                                                      row.email_address,
                                                      event.target.checked
                                                    )
                                                  }
                                                />
                                              }
                                            />
                                          );
                                        case 'departmentList':
                                          return (
                                            <FormControlLabel
                                              control={
                                                <Switch
                                                  color="primary"
                                                  checked={row.is_active}
                                                  onClick={(event) =>
                                                    toggleSetDepartment(
                                                      event,
                                                      row.department_code,
                                                      event.target.checked
                                                    )
                                                  }
                                                />
                                              }
                                            />
                                          );
                                        case 'role':
                                          return (
                                            <FormControlLabel
                                              control={
                                                <Switch
                                                  color="primary"
                                                  checked={row.is_active}
                                                  onClick={(event) =>
                                                    toggleSetActiveRole(
                                                      event,
                                                      row.role_template_id,
                                                      event.target.checked
                                                    )
                                                  }
                                                />
                                              }
                                            />
                                          );
                                      }
                                    })()}
                                  </>
                                </TableCell>
                              )}
                              {displayOptions.menuButtons && (
                                <TableCell align="left">
                                  <div className={classes.handleButtonWrap}>
                                    {buttonDeptRemoveUser && (
                                      <Tooltip title={buttonDeptRemoveUser.text}>
                                        <Button
                                          className={`${classes.handleButton} ${classes.handleButtonNote}`}
                                          onClick={() => handleRemoveAccount(row.email_address)}
                                        >
                                          <RemoveCircleOutlineIcon className={classes.noteButtonIcon} />
                                        </Button>
                                      </Tooltip>
                                    )}
                                    {buttonRemoveAccountRole && (
                                      <Tooltip title={buttonRemoveAccountRole.text}>
                                        <Button
                                          className={`${classes.handleButton} ${classes.handleButtonNote}`}
                                          onClick={() => handleRemoveAccountToRole(row.email_address)}
                                        >
                                          <RemoveCircleOutlineIcon className={classes.noteButtonIcon} />
                                        </Button>
                                      </Tooltip>
                                    )}
                                  </div>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 15, 20]}
                    component="div"
                    rowsPerPage={no_item_per_page}
                    labelRowsPerPage="Số tài liệu mỗi trang"
                    count={count}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Card>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
