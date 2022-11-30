// ** React Imports
import { Fragment } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

// ** Icons Imports
import Close from 'mdi-material-ui/Close';
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline';

// ** Third Party Imports
import { useDropzone } from 'react-dropzone';
import { FolderPlusOutline } from 'mdi-material-ui';

// File 타입 정의
interface FileType {
  name: string;
  type: string;
  size: number;
}

// props 타입 정의
interface FileUploaderMultipleProp {
  files: File[];
  setFiles: (value: File[]) => void;
}

// 다중 파일 업로드 관련 컴포넌트
const FileUploaderMultiple = ({ files, setFiles }: FileUploaderMultipleProp) => {
  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
  });

  const renderFilePreview = (file: FileType) => {
    if (file.type.startsWith('')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />;
    } else {
      return <FileDocumentOutline />;
    }
  };

  const handleRemoveFile = (file: FileType) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i: FileType) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map((file: FileType) => (
    <ListItem key={file.name}>
      <div className="file-details">
        <div className="file-preview">{renderFilePreview(file)}</div>
        <div>
          <Typography className="file-name">{file.name}</Typography>
          <Typography className="file-size" variant="body2">
            {Math.round(file.size / 100) / 10 > 1000
              ? `${(Math.round(file.size / 100) / 10000).toFixed(1)} mb`
              : `${(Math.round(file.size / 100) / 10).toFixed(1)} kb`}
          </Typography>
        </div>
      </div>
      <IconButton onClick={() => handleRemoveFile(file)}>
        <Close fontSize="small" />
      </IconButton>
    </ListItem>
  ));

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <FolderPlusOutline sx={{ height: '1.75rem' }} />
            <Typography variant="subtitle1" sx={{ ml: 1.5 }}>
              원하는 첨부파일을 선택하거나 파일에서 드래그하여 추가해주세요.
            </Typography>
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default FileUploaderMultiple;
