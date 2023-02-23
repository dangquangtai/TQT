import React from 'react';
import clsx from 'clsx';
import { makeStyles, useMediaQuery, useTheme, AppBar, CssBaseline, Toolbar } from '@material-ui/core';
import { useSelector } from 'react-redux';
import { drawerWidth } from './../../store/constant';
import Header from './Header';
import Sidebar from './Sidebar';
import FloatingMenu from '../../views/FloatingMenu';
import UploadFile from '../../views/FloatingMenu/UploadFile';
import Loading from './Loading';
import useLoading from './../../hooks/useLoading';
import ConfirmPopup from '../../views/ConfirmPopup';
import AccountModal from '../../views/Account/Detail';
import RoleModal from '../../views/Role/Detail';
import DepartmentModal from '../../views/Department/Detail';
import ProcessRoleModal from '../../views/ProcessRole/Detail';
import ProcessRoleUserModal from '../../views/ProcessRole/User';
import ProcessRoleDeptModal from '../../views/ProcessRole/Department';
import WorkorderModal from '../../views/WORKORDER/Detail';
import DepartmentListModal from '../../views/DepartmentList/Detail';
import CategoryModal from './../../views/CategoryDetail/index';
import ProductModal from './../../views/Product/Product/Detail/index';
import OrderModal from './../../views/Order/Detail/index';
import SupplierModal from './../../views/Supplier/Detail/index';
import CustomerModal from './../../views/Customer/Detail/index';
import InventoryModal from './../../views/Material/Inventory/Detail/index';
import InventoryCheckModal from './../../views/Material/InventoryCheck/Detail/index';
import PurchaseMaterialModal from './../../views/Material/Purchase/Detail/index';
import ReceivedMaterialModal from './../../views/Material/Received/Detail/index';
import MaterialWarehouseModal from './../../views/Material/Warehouse/Detail/index';
import WorkshopModal from './../../views/Setting/Workshop/Detail/index';
import ProductWarehouseModal from './../../views/Product/Warehouse/Detail/index';
import GoodsIssueModal from './../../views/Product/GoodsIssue/Detail/index';
import GoodsReceiptModal from './../../views/Product/GoodsReceipt/Detail/index';

import ProductionRequestModal from '../../views/Production/Detail';

import DeliveryMaterialModal from '../../views/Material/DailyMaterialRequisition/Detail';
import DailyMaterialReceivedModal from './../../views/Production/DailyMaterialReceived/Detail/index';
import DailyMaterialRequisitionModal from './../../views/Production/DailyMaterialRequisition/Detail/index';
import MaterialPartModal from '../../views/Material/MaterialPart/Detail';
import MaterialRequisitionModal from './../../views/Material/Requisition/Detail/index';
import ReturnMaterialModal from './../../views/Material/Return/Detail/index';
import TemplateDocumentModal from '../../views/Setting/DocumentTemplate/ExcelDocument/Detail';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    width: '100%',
    minHeight: '100vh',
    flexGrow: 1,
    /*padding: theme.spacing(3),*/
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up('md')]: {
      marginLeft: `calc(-${drawerWidth}px + 100px )`,
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  main: {
    padding: '20px 40px',
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(3),
    },
  },
  header: {
    zIndex: 1201,
  },
}));

const MainLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { loading } = useLoading();

  const { documentType } = useSelector((state) => state.document);

  const renderDetailDialog = () => {
    switch (documentType) {
      case 'account':
        return <AccountModal />;
      case 'department':
        return <DepartmentModal />;
      case 'role':
        return <RoleModal />;
      case 'processrole':
        return (
          <>
            <ProcessRoleModal />
            <ProcessRoleUserModal />
            <ProcessRoleDeptModal />
          </>
        );
      case 'departmentList':
        return <DepartmentListModal />;
      case 'materialCategory':
      case 'supplierCategory':
      case 'productCategory':
      case 'customerCategory':
      case 'warehouseCategory':
        return <CategoryModal />;
      case 'product':
        return <ProductModal />;
      case 'order':
        return <OrderModal />;
      case 'workorder':
        return <WorkorderModal />;
      case 'supplier':
        return <SupplierModal />;
      case 'customer':
        return <CustomerModal />;
      case 'materialInventory':
        return <InventoryModal />;
      case 'materialInventoryCheck':
        return <InventoryCheckModal />;
      case 'purchaseMaterial':
        return <PurchaseMaterialModal />;
      case 'receivedMaterial':
        return <ReceivedMaterialModal />;
      case 'materialWarehouse':
        return <MaterialWarehouseModal />;
      case 'workshop':
        return <WorkshopModal />;
      case 'productWarehouse':
        return <ProductWarehouseModal />;
      case 'goodsIssue':
        return <GoodsIssueModal />;
      case 'goodsReceipt':
        return <GoodsReceiptModal />;
      case 'production':
        return <ProductionRequestModal />;
      case 'deliveryMaterial':
        return <DeliveryMaterialModal />;
      case 'dailyMaterialReceived':
        return <DailyMaterialReceivedModal />;
      case 'dailyMaterialRequisition':
        return <DailyMaterialRequisitionModal />;
      case 'materialPart':
        return <MaterialPartModal />;
      case 'materialRequisition':
        return <MaterialRequisitionModal />;
      case 'returnMaterial':
        return <ReturnMaterialModal />;
      case 'templateDocument':
        return <TemplateDocumentModal />;
      default:
        return null;
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  React.useEffect(() => {
    setDrawerOpen(false);
  }, [matchUpMd]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.header}>
        <Toolbar>
          <Header drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
        </Toolbar>
      </AppBar>
      <Sidebar drawerOpen={drawerOpen} drawerToggle={handleDrawerToggle} />
      <main className={clsx(classes.content, { [classes.contentShift]: drawerOpen })}>
        <div className={classes.toolbar} />
        <div className={classes.main}>{children}</div>
        <FloatingMenu />
        <UploadFile />
        {renderDetailDialog()}
      </main>
      {loading && <Loading />}
      <ConfirmPopup />
    </div>
  );
};

export default MainLayout;
