import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import React from 'react';
import Divider from '@mui/material/Divider';

type BoardLeftInHeader = {
  title: string;
  maincategory?: string | null;
  subcategory?: string | null;
};

// 게시글 헤더 UI
const BoardLeftInHeader = (props: BoardLeftInHeader) => {
  const { title, maincategory, subcategory } = props;

  console.log('t', maincategory);

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
            <Box sx={{ display: 'flex' }}>
              <Typography variant="body2">{maincategory || null}</Typography>
              <Box sx={{ ml: 1.2, mr: 1.2 }}>
                <Typography variant="body2">{'>'}</Typography>
              </Box>
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
