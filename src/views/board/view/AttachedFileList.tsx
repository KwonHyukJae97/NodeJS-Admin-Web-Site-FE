// ** MUI Imports
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { FileDownloadOutline } from 'mdi-material-ui';

// ** axios
import Api from 'src/utils/api';
import apiConfig from 'src/configs/api';

// props 타입 정의
interface AttachedFileListProps {
  fileList: any;
}

// 첨부파일 목록 UI
const AttachedFileList = ({ fileList }: AttachedFileListProps) => {
  // 다운로드 파일 이름을 추출하는 함수
  const extractDownloadFilename = (res: any) => {
    const disposition = res.headers['content-disposition'];
    const fileName = decodeURI(
      disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)[1].replace(/['"]/g, ''),
    );

    return fileName;
  };

  // 파일 다운로드 API 호출
  const getFileDownload = async (fileId: number) => {
    try {
      const res = await Api.get(`${apiConfig.apiEndpoint}/file/${fileId}`, {
        responseType: 'blob',
      });

      // 다운로드(서버에서 전달 받은 데이터) 받은 바이너리 데이터를 blob으로 변환
      const blob = new Blob([res.data]);

      // blob을 사용해 객체 URL을 생성
      const fileObjectUrl = window.URL.createObjectURL(blob);

      // blob 객체 URL를 설정
      const link = document.createElement('a');
      link.href = fileObjectUrl;
      link.style.display = 'none';

      // 다운로드 파일 이름 지정
      // 일반적으로 서버에서 전달해준 파일 이름은 응답 Header의 Content-Disposition에 설정
      link.download = extractDownloadFilename(res);

      // 링크를 body에 추가하고 강제로 click 이벤트를 발생시켜 파일 다운로드를 실행
      document.body.appendChild(link);
      link.click();
      link.remove();

      // 다운로드가 끝난 리소스(객체 URL)를 해제
      window.URL.revokeObjectURL(fileObjectUrl);
    } catch (err) {
      console.log(err);
    }
  };

  // 파일 영역 클릭 시 호출
  const handleFileDownload = (fileId: number) => {
    getFileDownload(fileId);
  };

  return (
    <>
      <Divider sx={{ ml: 12, mr: 12, mt: 6, mb: 6, borderBottomWidth: 'unset' }} />
      <Box sx={{ ml: 14, mr: 14, mt: 4, mb: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
          첨부파일
        </Typography>
      </Box>
      {fileList.map((file: any) => {
        return (
          <Box
            key={file.boardFileId}
            sx={{ ml: 14, mr: 14, mt: 2, mb: 2, display: 'flex' }}
            onClick={() => handleFileDownload(file.boardFileId)}
          >
            <FileDownloadOutline sx={{ height: '1.25rem' }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 600, ml: 0.5 }}>
              {file.originalFileName}
              {file.fileExt}
            </Typography>
          </Box>
        );
      })}
      <Divider sx={{ ml: 12, mr: 12, mt: 6, mb: 10, borderBottomWidth: 'unset' }} />
    </>
  );
};

export default AttachedFileList;
