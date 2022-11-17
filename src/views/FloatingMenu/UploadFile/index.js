import { Divider, Grid, makeStyles, Typography, useMediaQuery, useTheme } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import React from 'react';
import Dropzone, { useDropzone } from 'react-dropzone';
import api from '../../../services/api';
import { apiDomain, apiEndpoints, gridSpacing } from '../../../store/constant';

function getModalStyle() {
  return {
    top: '50%',
    left: '50%',
    transform: `translate(-50%, -50%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  divider: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  dropzone: {
    textAlign: 'center',
    padding: '30px',
    border: '3px dashed #eeeeee',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    cursor: 'pointer',
    marginBottom: '20px',
  },
}));

export default function PermissionModal(props) {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownXs = useMediaQuery(theme.breakpoints.down('xs'));
  const [modalStyle] = React.useState(getModalStyle);

  const [selectedFiles, setSelectedFile] = React.useState([]);
  
  // const { onSuccess } = props
  const { open: openDialog, onSuccess, onClose } = props;

  // const { file: openDialog } = useSelector((state) => state.floatingMenu);

  function onDrop(files) {
    setSelectedFile(files);
  }
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.jpeg,.png,.csv,.doc,.docx,.xls,.xlsx,.jpg',
    onDrop,
  });

  // function onClose() {
  //     setSelectedFile([])
  //     dispatch({type: FLOATING_MENU_CHANGE, folder: false })
  // }

  async function uploadToStorage(event) {
    event.preventDefault();
    const uploadData = new FormData();
    uploadData.append('file', selectedFiles[0]);
    const { data: file } = await api.post(apiEndpoints.upload, uploadData);
    // await axiosInstance.post(apiEndpoints.upload_file_to_document, { outputtype: "RawJson", project_id: selectedProject.id, document_id: documentId, file_name: selectedFiles[0].name,
    //     file_url: `${apiDomain}/${file.filename}`
    // })
    setSelectedFile([]);
    onSuccess(`${apiDomain}/${file.filename}`);
    onClose();
  }

  return (
    <Modal
      open={openDialog || false}
      onClose={onClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div
        style={{ ...modalStyle, width: matchDownXs ? '100%' : '500px' }}
        className={classes.paper}
      >
        <Typography variant="subtitle1">Tải file lên</Typography>
        <Divider className={classes.divider} />
        <Dropzone multiple={false}>
          {() => (
            <section>
              <div {...getRootProps({ className: classes.dropzone })}>
                <input {...getInputProps()} />
                {selectedFiles.length && selectedFiles[0].name ? (
                  <div className="selected-file">
                    {selectedFiles.length && selectedFiles[0].name}
                  </div>
                ) : (
                  'Kéo thả file vào đây, hoặc click để bắt đầu chọn'
                )}
              </div>
            </section>
          )}
        </Dropzone>
        <Grid container justifyContent="flex-end" spacing={gridSpacing}>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={onClose}>
              Đóng
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              disabled={!selectedFiles}
              onClick={uploadToStorage}
            >
              Tải lên
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
}
