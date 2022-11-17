import { makeStyles } from '@material-ui/core/styles';

export const style = {
  datePickerWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  datePickerLabel: {
    marginRight: '12px',
    minWidth: '84px',
  },
  datePickerInput: {
    border: 'unset',
    background: 'transparent',
    outline: 'none',
  },
  starIcon: {
    color: '#4472C4',
    fontSize: '20px',
  },
  tableTitleWrap: {
    marginTop: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(0 ,0, 0, 0.12)',
    display: 'flex',
  },
  tableTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  assessWrap: {
    display: 'flex',
    justifyContent: 'center',
  },
  meetingLink: {
    color: 'unset',
    textDecoration: 'none !important',
  },
  ratingWrap: {
    display: 'flex',
  },
  statusWrap: {
    padding: '12px',
    color: '#fff',
    borderRadius: '24px',
    background: '#36f',
  },
  tableUserAvatar: {
    height: '50px',
    width: '50px',
    objectFit: 'cover',
    boxShadow: 'rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px',
    borderRadius: '4px',
  },
};

export const useStyles = makeStyles((theme) => ({
  root: {
    boxShadow: 'unset',
    height: '100%',
  },
  paper: {
    width: '100%',
    backgroundColor: '#f0f2f8',
    paddingBottom: '56px',
    minHeight: '320px',
  },
  table: {
    minWidth: 750,
    borderSpacing: '0 10px',
    '& > thead': {
      background: '#FFFFFF',
    },
    '& > thead > tr > th': {
      background: 'unset',
      position: 'relative !important',
    },
    '& > tbody > tr:hover': {
      backgroundColor: '#36f !important',
    },
    '& > tbody > tr:hover td': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td span': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td svg': {
      fill: '#FFF',
    },
  },
  table2: {
    minWidth: 950,
    maxWidth: 950,
    borderSpacing: '0 10px',
    '& > thead': {
      background: '#FFFFFF',
    },
    '& > thead > tr > th': {
      background: 'unset',
      position: 'relative !important',
    },
    '& > tbody > tr:hover': {
      backgroundColor: '#36f !important',
    },
    '& > tbody > tr:hover td': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td span': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td svg': {
      fill: '#FFF',
    },
  },
  table3: {
    minWidth: 450,
    maxWidth: 450,
    borderSpacing: '0 10px',
    '& > thead': {
      background: '#FFFFFF',
    },
    '& > thead > tr > th': {
      background: 'unset',
      position: 'relative !important',
    },
    '& > tbody > tr:hover': {
      backgroundColor: '#36f !important',
    },
    '& > tbody > tr:hover td': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td span': {
      color: '#FFF',
    },
    '& > tbody > tr:hover td svg': {
      fill: '#FFF',
    },
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    width: '100%',
  },
  search: {
    position: 'relative',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    minWidth: '200px',
    maxWidth: '400px',
    [theme.breakpoints.down('sm')]: {
      marginLeft: 0,
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
  },
  rowImages: {
    height: '40px',
    width: '60px',
  },
  tableRow: {
    background: '#fff',
    boxShadow: '0 2px 6px -1px rgb(0 0 0 / 10%)',
  },
  tableItemName: {
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  tableItemID: {
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
  },
  handleButtonWrap: {
    display: 'flex',
    alignItems: 'center',
  },
  handleButton: {
    height: '34px',
    width: '34px',
    margin: '0 4px',
    padding: '12px',
    color: '#FFFFFF',
    minWidth: '34px',
    borderRadius: '50%',
    background: '#36f',
    boxShadow:
      '0px 3px 5px -1px rgb(0 0 0 / 20%), 0px 6px 10px 0px rgb(0 0 0 / 14%), 0px 1px 18px 0px rgb(0 0 0 / 12%)',
    '&:hover': {
      background: '#0043a9',
    },
  },
  handleButtonCancel: {
    background: '#425466',
    '&:hover': {
      background: '#272f33',
    },
  },
  handleButtonApprove: {
    background: '#425466',
    '&:hover': {
      background: '#272f33',
    },
  },
  handleButtonMeeting: {
    background: '#30bc41',
    '&:hover': {
      background: '#30bc41',
    },
  },
  handleButtonNote: {
    background: '#ffca33',
    '&:hover': {
      background: '#f9c121',
    },
  },
  handleButtonIcon: {
    fontSize: '20px',
    width: '20px',
  },
  noteButtonIcon: {},
  handleButtonIconMeeting: {
    fontSize: '20px',
    width: '20px',
    marginLeft: '-5px',
    marginTop: '-20px',
  },

  waitingStatus: {
    background: 'rgba(47, 210, 17, 0.8) !important',
  },
  handleStatus: {
    background: 'rgb(255 168 8 / 80%) !important',
    color: '#000000 !important',
  },
  cancelStatus: {
    background: 'rgb(171 0 0 / 80%) !important',
  },
  completedStatus: {
    background: '#36f',
  },
  styleStatus1: {
    background: '#FF9400 !important',
  },
  styleStatus2: {
    background: '#6200A5 !important',
  },
  styleStatus3: {
    background: '#0FAD00 !important',
  },
  styleStatus4: {
    background: '#00A2C8 !important',
  },
  styleStatus5: {
    background: '#8DC700 !important',
  },
  styleStatus6: {
    background: '#FF6600 !important',
  },
  styleStatus7: {
    background: '#ffc501 !important',
  },
  styleStatus8: {
    background: '#FE0000 !important',
  },
  styleStatus9: {
    background: '#0064B4 !important',
  },
  styleStatus10: {
    background: '#FDFD01 !important',
  },
  styleStatus11: {
    background: '#C4007C !important',
  },
  styleStatus12: {
    background: '#0010A4 !important',
  },
  styleStatus13: {
    background: '#ffa500 !important',
  },
  styleStatus14: {
    background: '#1ecd2b !important',
  },
  styleStatus15: {
    background: '#24a9bf !important',
  },
}));
