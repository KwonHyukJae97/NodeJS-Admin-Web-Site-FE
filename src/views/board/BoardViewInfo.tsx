// ** React Imports
import { Ref } from 'react';

// ** Mui Imports
import Box from '@mui/material/Box';
import CustomChip from '../../@core/components/mui/chip';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

type BoardViewInfoProps = {
  isTop?: boolean | null;
  categoryName?: string;
  title: string;
  regDate: string;
  writer?: string;
  htmlStr: string;
  viewContentRef?: Ref<HTMLDivElement>;
};

// 게시글 정보 UI 컴포넌트
const BoardViewInfo = ({
  isTop,
  categoryName,
  title,
  regDate,
  writer,
  htmlStr,
  viewContentRef,
}: BoardViewInfoProps) => {
  return (
    <>
      {/* 공지사항일 경우 */}
      {isTop != null ? (
        <Box sx={{ ml: 13, mt: 7, display: 'flex' }}>
          {isTop ? (
            <CustomChip
              skin="light"
              size="medium"
              label="중요"
              color="primary"
              sx={{
                '& .MuiChip-label': { lineHeight: '18px' },
                fontWeight: 700,
                fontSize: '0.95rem',
                mr: 2.5,
              }}
            />
          ) : null}
          <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
            {title}
          </Typography>
        </Box>
      ) : null}

      {/* FAQ/QnA일 경우 */}
      {categoryName != null ? (
        <Box sx={{ ml: 13, mt: 7, display: 'flex', alignItems: 'center' }}>
          <Box sx={{ display: 'flex' }}>
            <Divider sx={{ borderLeftWidth: 'medium', mt: 1, mb: 1 }} />
            <Box sx={{ mr: 3.5, ml: 3.5 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                {categoryName}
              </Typography>
            </Box>
            <Divider sx={{ borderRightWidth: 'medium', mr: 2.5, mt: 1, mb: 1 }} />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
            {title}
          </Typography>
        </Box>
      ) : (
        <Box sx={{ ml: 13, mt: 7 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, ml: 1 }}>
            {title}
          </Typography>
        </Box>
      )}

      <Box sx={{ ml: 14, mr: 14, mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          {regDate}
        </Typography>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          작성자ㅣ{writer}
        </Typography>
      </Box>

      <Divider sx={{ ml: 12, mr: 12, mt: 6, borderBottomWidth: 'unset' }} />

      <Box sx={{ ml: 14, mr: 14, mt: 8, mb: 8 }} ref={viewContentRef}>
        <Typography variant="body1">{htmlStr}</Typography>
      </Box>
    </>
  );
};

export default BoardViewInfo;
