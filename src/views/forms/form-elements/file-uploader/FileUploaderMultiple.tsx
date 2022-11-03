// ** React Imports
import { Fragment, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography, { TypographyProps } from '@mui/material/Typography';

// ** Icons Imports
import Close from 'mdi-material-ui/Close';
import FileDocumentOutline from 'mdi-material-ui/FileDocumentOutline';

// ** Third Party Imports
import { useDropzone } from 'react-dropzone';
import { FolderPlusOutline } from 'mdi-material-ui';

interface FileProp {
  name: string;
  type: string;
  size: number;
}

// Styled component for the upload image inside the dropzone area
const Img = styled('img')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    marginRight: theme.spacing(10),
  },
  [theme.breakpoints.down('md')]: {
    marginBottom: theme.spacing(4),
  },
  [theme.breakpoints.down('sm')]: {
    width: 250,
  },
}));

// Styled component for the heading inside the dropzone area
const HeadingTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  marginBottom: theme.spacing(5),
  [theme.breakpoints.down('sm')]: {
    marginBottom: theme.spacing(4),
  },
}));

const FileUploaderMultiple = () => {
  // ** State
  const [files, setFiles] = useState<File[]>([]);

  // ** Hooks
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      setFiles(acceptedFiles.map((file: File) => Object.assign(file)));
    },
  });

  const renderFilePreview = (file: FileProp) => {
    if (file.type.startsWith('image')) {
      return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />;
    } else {
      return <FileDocumentOutline />;
    }
  };

  const handleRemoveFile = (file: FileProp) => {
    const uploadedFiles = files;
    const filtered = uploadedFiles.filter((i: FileProp) => i.name !== file.name);
    setFiles([...filtered]);
  };

  const fileList = files.map((file: FileProp) => (
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

  // const handleLinkClick = (event: SyntheticEvent) => {
  //   event.preventDefault();
  // };
  //
  // const handleRemoveAllFiles = () => {
  //   setFiles([]);
  // };

  return (
    <Fragment>
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/*<Img width={300} alt='Upload img' src='/images/misc/upload.png' />*/}
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
            {/*<Typography color="textSecondary">*/}
            {/*  Drop files here or click{' '}*/}
            {/*  <Link href="/" onClick={handleLinkClick}>*/}
            {/*    browse*/}
            {/*  </Link>{' '}*/}
            {/*  thorough your machine*/}
            {/*</Typography>*/}
          </Box>
        </Box>
      </div>
      {files.length ? (
        <Fragment>
          <List>{fileList}</List>
          {/*<div className="buttons">*/}
          {/*  <Button color="error" variant="outlined" onClick={handleRemoveAllFiles}>*/}
          {/*    Remove All*/}
          {/*  </Button>*/}
          {/*  <Button variant="contained">Upload Files</Button>*/}
          {/*</div>*/}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default FileUploaderMultiple;
