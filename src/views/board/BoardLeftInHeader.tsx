// ** React
import React from 'react';

// ** MUI Imports
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { mdiChevronLeft } from '@mdi/js';
import Icon from '@mdi/react';

// props 타입 정의
interface BoardLeftInHeaderProps {
  title: string;
  maincategory?: string | null;
  subcategory?: string | null;
}

// 게시글 헤더 UI
const BoardLeftInHeader = ({ title, maincategory, subcategory }: BoardLeftInHeaderProps) => {
  return (
    <>
      <Box sx={{ mt: 10, ml: 14, display: 'flex', alignItems: 'center' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        {maincategory !== undefined ? (
          <>
            <Divider sx={{ ml: 3, mr: 3, borderLeftWidth: 'unset', height: 16 }} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2">{maincategory || null}</Typography>
              <Icon path={mdiChevronLeft} size={0.85} horizontal color="lightgrey" />
              <Typography variant="body2">{subcategory || null}</Typography>
            </Box>
          </>
        ) : null}
      </Box>
      <Divider sx={{ ml: 12, mr: 12, borderBottomWidth: 'unset' }} />
    </>
  );
};

export default BoardLeftInHeader;
