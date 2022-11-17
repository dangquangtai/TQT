import { lighten, makeStyles } from '@material-ui/core/styles';

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  title: {
    flex: '1 2 100%',
  },
  toolButtonWrap: {
    position: 'relative',
  },
  toolButton: {
    margin: '0 4px',
    padding: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
    minWidth: '40px',
    borderRadius: '50%',
    '&:hover': {
      color: '#36f',
    },
  },
  toolButtonActive: {
    color: '#36f',
  },
  toolButtonIcon: {
    fontSize: '20px',
    width: '20px',
  },
  toolSearchWrap: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    padding: '8px 12px !important',
  },
  toolSearchInput: {
    border: 'unset',
    borderBottom: '1px solid rgb(18, 23, 30)',
    color: '#12171e',
    width: '100%',
    outline: 'none',
    fontSize: '14px',
    marginLeft: '8px',
    padding: '6px 0',
    background: 'transparent',
    transform: 'translateY(-6px)',
    '&:hover': {
      borderColor: '#000',
    },
    '&:focus': {
      borderColor: '#3467FF',
      borderWidth: '2px',
    },
  },
  toolButtonSearch: {
    padding: '12px',
    color: 'rgba(0, 0, 0, 0.54)',
    minWidth: '40px',
    borderRadius: '50%',
    '&:hover': {
      color: '#FF413A',
    },
  },
  toolColumn: {
    zIndex: '9999',
    position: 'absolute',
    top: '32px',
    right: 0,
    minWidth: '200px',
    background: '#FFFFFF',
    transform: 'translateX(60px)',
    padding: '4px 12px 0 24px',
    boxShadow:
      '0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)',
    borderRadius: '10px',
  },
  toolColumnTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    '& > div': {
      fontWeight: 500,
    },
  },
  toolColumnBody: {
    paddingRight: '12px',
    marginLeft: '-12px',
    maxHeight: '190px',
    overflowY: 'scroll',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  },
  toolColumnNameWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  toolFilter: {
    transform: 'unset',
    minWidth: '380px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  toolFilterTitle: {
    justifyCentent: 'space-between',
  },
  toolFilterTitleBlock: {
    display: 'flex',
    alignItems: 'center',
  },
  toolFilterBody: {
    maxHeight: 'unset',
    minHeight: '180px',
    marginTop: '16px',
    marginLeft: 'unset',
    flex: 1,
  },
  toolResetButton: {
    borderRadius: 'unset',
    fontSize: '12px',
    padding: '6px 8px',
    marginLeft: '16px',
    '&:hover': {
      color: '#36f',
    },
  },
  toolFilterItem: {
    width: '100%',
    padding: '16px 0',
  },
  btnCreateMentor: {
    padding: '6px 16px',
    color: '#FFF',
    background: '#3266FE',
    '&:hover': {
      color: '#FFF',
      background: '#3266FE',
    }
  }
}));

export default useToolbarStyles;