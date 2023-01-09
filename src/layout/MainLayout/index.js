import React from 'react';
import clsx from 'clsx';
import { makeStyles, useMediaQuery, useTheme, AppBar, CssBaseline, Toolbar, Snackbar, Slide } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
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
import { SNACKBAR_CLOSE } from '../../store/actions.js';
import Alert from './../../component/Alert/index';

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

function TransitionRight(props) {
  return <Slide {...props} direction="right" />;
}

const MainLayout = ({ children }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const { loading } = useLoading();
  const dispatch = useDispatch();

  const { documentType } = useSelector((state) => state.document);
  const { open, message, alertSeverity, anchorOrigin } = useSelector((state) => state.snackbar);

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
      default:
        return null;
    }
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch({ type: SNACKBAR_CLOSE });
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
