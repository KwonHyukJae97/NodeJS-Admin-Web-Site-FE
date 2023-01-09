// ** React Imports
import { Fragment, useState, MouseEvent } from 'react';

// ** MUI Imports
import { mdiSquareEditOutline, mdiTrashCanOutline } from '@mdi/js';
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DotsVertical from 'mdi-material-ui/DotsVertical';

// ** Icons Imports
import IconButton from '@mui/material/IconButton';
import PostAddIcon from '@mui/icons-material/PostAdd';
import UploadFileIcon from '@mui/icons-material/UploadFile';

// ** Next Import
import Link from 'next/link';

// 액션버튼 타입 정의
interface ActionButtonType {
  actions: 'edit' | 'delete' | 'others';
  path: string;
  id: number | string;
}

// 액션버튼 컴포넌트
const ActionButton = (props: ActionButtonType) => {
  // ** Props
  const { actions, path, id } = props;

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {actions === 'edit' ? (
        <Link href={`${path}/${id}`} passHref>
          <Button sx={{ minWidth: 0, p: 1.25 }}>
            <Icon
              path={mdiSquareEditOutline}
              size={0.75}
              horizontal
              vertical
              rotate={90}
              color="grey"
            />
          </Button>
        </Link>
      ) : actions === 'delete' ? (
        <Link href={`${path}/${id}`} passHref>
          <Button sx={{ minWidth: 0, p: 1.25 }}>
            <Icon
              path={mdiTrashCanOutline}
              size={0.75}
              horizontal
              vertical
              rotate={90}
              color="grey"
            />
          </Button>
        </Link>
      ) : actions === 'others' ? (
        <Fragment>
          <IconButton size="small" onClick={handleRowOptionsClick}>
            <DotsVertical />
          </IconButton>
          <Menu
            keepMounted
            anchorEl={anchorEl}
            open={rowOptionsOpen}
            onClose={handleRowOptionsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Link href={`${path}`} passHref>
              <MenuItem>
                <UploadFileIcon fontSize="small" sx={{ mr: 2 }} />
                엑셀 등록
              </MenuItem>
            </Link>
            <Link href={`${path}`} passHref>
              <MenuItem>
                <PostAddIcon fontSize="small" sx={{ mr: 2 }} />
                수기 등록
              </MenuItem>
            </Link>
          </Menu>
        </Fragment>
      ) : null}
    </Box>
  );
};

export default ActionButton;
