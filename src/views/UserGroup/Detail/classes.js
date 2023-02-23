import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
  editBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 500,
    boxShadow: 24,
    background: '#FFFFFF',
    padding: '16px 32px',
    borderRadius: '15px',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '100vh',
      overflowY: 'scroll',
      minWidth: '100%',
      maxWidth: '100%',
      padding: '16px',
      borderRadius: 'unset'
    },
  },
  dialogTitle: {
    background: '#F1F1F9 !important',
    padding: '8px 24px',

  },
  dialogContent: {
    padding: '0 24px',
    overflowY: 'hidden'
  },
  gridItemInfo: {
    padding: '0 12px 10px',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 0'
    },
  },
  gridItem: {
    padding: '0 12px 12px',
    [theme.breakpoints.down('xs')]: {
      padding: '8px 0'
    },
  },
  tabItemMentorAvatarBody: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    '& img': {
      height: '120px',
      width: '120px',
      borderRadius: '5px',
      marginBottom: '16px',
      border: '1px solid #ddd',
      objectFit: 'cover',
      padding: '4px',
      boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px',
    },
    '& button': {
      marginTop: '8px',
      padding: '6px 16px',
      color: '#FFF',
      background: '#3266FE',
      '&:hover': {
        color: '#FFF',
        background: '#3266FE',
      },
    },
  },
  multpleSelectField: {
    padding: '1px 12px',
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    '&:before': {
      border: 'none !important'
    }
  },
  useradddialog: {
    '&>div:nth-child(3)': {
      justifyContent: 'flex-end',
      '&>div': {
        background: '#f1f1f9',
        margin: '0px',
        borderRadius: '0px',
        maxWidth: '70vw',
        minWidth: '70vw',
        maxHeight: '100%',
        overflowY: 'hidden',
        [theme.breakpoints.down('md')]: {
          minWidth: '100%',
          maxWidth: '100%',
        },
        [theme.breakpoints.down('xs')]: {
          minWidth: '100%',
          maxWidth: '100%',
        },
        '&>div:first-child': {
          background: 'unset !important',
        }
      },
    },
  },
  icon: {
    width: '80px',
    height: '80px',
    [theme.breakpoints.down('xs')]: {
      width: '40px',
      height: '40px',
    },
  },
  text: {
    minHeight: '3.2em',
    maxHeight: '3.2em',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  folderContainer: {
    margin: '0 10px 20px',
    border: '1px solid gray',
    position: 'relative',
  },
  selectedIcon: {
    width: '35px',
    height: '35px',
    color: '#4295f5',
    position: 'absolute',
    top: '-15px',
    left: '-15px',
  },
  selectedIconNotselected: {
    width: '35px',
    height: '35px',
    color: '#637487',
    position: 'absolute',
    top: '-15px',
    left: '-15px',
  },
  description: {
    border: '1px rgba(0, 0, 0, 0.23) solid',
    borderRadius: '4px',
    padding: '10px',
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
  },
  presentImage: {
    height: '80px',
    width: '110px',
  },
  button: {
    margin: theme.spacing(0.5, 0),
    background: '##FFC000',
  },
  listSelectedNews: {
    minHeight: '300px',
    maxHeight: '600px',
  },
  imageNotice: {
    margin: theme.spacing(0, 0),
  },
  tableTitle: {
    textAlign: 'center!important',
    fontSize: '1.25rem',

    marginBottom: '0.5rem',
    marginTop: '0.5rem',
    fontWeight: '500',
    lineHeight: '1.2',
  },
  table: {
    border: '1px solid #dee2e6',
    width: '100%',
    marginBottom: '1rem',
    color: '#212529',
    borderCollapse: 'collapse',
  },
  th: {
    borderBottomWidth: '2px',
    verticalAlign: 'bottom',
    borderBottom: '2px solid #dee2e6',
    border: '1px solid #dee2e6',
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    textAlign: 'center',
  },
  td: {
    border: '1px solid #dee2e6',
    padding: '0.75rem',
    verticalAlign: 'top',
    borderTop: '1px solid #dee2e6',
    textAlign: 'center',
  },
  pb: {
    paddingBottom: '12px',
  },
  pl: {
    paddingLeft: '12px',
  },
  pr: {
    paddingRight: '12px',
  },
  feedbackAssess: {
    display: 'flex',
    alignItems: 'center',
    '& > div:first-child': {
      marginRight: '12px',
    },
  },
  feedbackStar: {
    transform: 'translateY(1px)',
    color: '#4472C4',
    fontSize: '20px',
  },
  timeNumberInput: {
    minWidth: '52px',
    height: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fontBold: {
    fontWeight: 'bold',
  },
  feedbackTextInput: {
    width: '100%',
    marginTop: '12px',
  },
  tabLabels: {
    display: 'flex',
    alignItems: 'center',
    '& > svg': {
      marginRight: '8px',
    }
  },
  tabActiveIcon: {
    color: '#36f'
  },
  tabItem: {
    background: '#FFFFFF',
    borderRadius: '8px',
    marginBottom: '8px',
    boxShadow: 'rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px'
  },
  tabItemTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    marginBottom: '16px',
    borderBottom: '1px solid #ddd'
  },
  tabItemLabel: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 'bold',
    '& span': {
      marginLeft: '8px'
    }
  },
  tabItemEdit: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& span': {
      marginLeft: '8px'
    }
  },
  tabItemBody: {
    padding: '0 16px 16px',
  },
  tabItemLabelField: {
    fontWeight: 'bold'
  },
  unUpperCase: {
    textTransform: 'unset !important'
  },
  mentorDateTimeWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  mentorDateTime: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: '500'
  },
  tabItemNoteSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: '#612AFF',
    color: '#ffffff',
    borderRadius: '8px',
    '& > a': {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      color: '#FFFFFF',
      textDecoration: 'none',
      fontWeight: 500,
    },
    '& > a > img': {
      width: '50px',
      marginLeft: '8px'
    }
  },
  tabItemNoteTitleWrap: {
    '& div:first-child': {
      fontSize: '16px',
      fontWeight: 'bold'
    }
  },
  tabItemNoteHour: {
    fontSize: '18px',
    fontWeight: 'bold'
  },
  tabItemNoteSelection: {
    display: 'flex',
    alignItems: 'flex-end',
    padding: '16px',
    borderBottom: '1px solid #ddd'
  },
  tabItemNoteSelectionLabel: {
    width: '120px',
    fontWeight: 'bold',
    lineHeight: 1
  },
  selectedNoteListSection: {
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    widht: '100%',
    '&::-webkit-scrollbar': {
      height: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
    },
    [theme.breakpoints.down('xs')]: {
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }
  },
  selectedNoteItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '30px',
    background: '#642BF6',
    color: '#FFF',
    margin: '0 4px 4px 0',
  },
  tabItemNoteInputWrap: {
    flexDirection: 'column',
    alignItems: 'baseline',
    paddingTop: '8px',
    paddingBottom: '16px'
  },
  tabItemNoteInput: {
    marginTop: '8px'
  },
  tabItemAssessSection: {

  },
  tabItemAssessTitle: {
    overflow: 'hidden',
    height: '78px',
    padding: '8px 16px',
    background: '#EBAB01',
    borderTopLeftRadius: '8px',
    borderTopRightRadius: '8px',
    textAlign: 'center',
    position: 'relative',
    fontSize: '24px',
    lineHeight: '58px',
    fontWeight: 'bold',
    color: '#FFF'
  },
  tabItemAssessCup: {
    width: '60px',
    position: 'absolute',
    bottom: 0,
    left: '2px',
    transform: 'rotate(30deg) translateY(20px)',
  },
  tabAssessItemWrap: {
    padding: '16px'
  },
  tabAssessItem: {
    display: 'flex',
    alignItems: 'center',
  },
  tabAssessItemLabel: {
    display: 'flex',
    flexDirection: 'column',
    fontWeight: 500,
  },
  tabAssessItemStarWrap: {
    display: 'flex',
    alignItems: 'center'
  },
  imageaccount: { 
    height: '200px',
    width: '200px',
    boxShadow: 'rgb(50 50 93 / 25%) 0px 2px 5px -1px, rgb(0 0 0 / 30%) 0px 1px 3px -1px',
    borderRadius: '50%',
    border: '1px solid #ddd',
    objectFit: 'cover',
    padding: '4px',
    boxShadow: 'rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px'
  },
  inputField: {
    '& input': {
      padding: '8px 12px'
    }
  },
  gridItemCenter: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center'
  }
}));



export default useStyles;