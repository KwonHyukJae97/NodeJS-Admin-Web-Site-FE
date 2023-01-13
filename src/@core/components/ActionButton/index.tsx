// ** React Imports
import { Fragment, useState, MouseEvent } from 'react';

// ** MUI Imports
import Icon from '@mdi/react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';

// ** Icons Imports
import {
  mdiSquareEditOutline,
  mdiTrashCanOutline,
  mdiDotsVertical,
  mdiFileExcel,
  mdiNotePlus,
} from '@mdi/js';

// ** Next Import
import Link from 'next/link';

// 액션버튼 타입 정의
interface ActionButtonType {
  actions: 'edit' | 'delete' | 'others';
  path?: string;
  id?: number | string;
}

// 아이콘 타입 정의
interface IconType {
  iconName: string;
  rotate: number;
  path: string;
  id?: number | string;
  title?: string;
}

// ** link 스타일 적용
const StyledLink = styled('a')(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary,
}));

// 아이콘 컴포넌트
const Icons = (props: IconType) => {
  // ** Props
  const { iconName, rotate, path, id, title } = props;

  return (
    <Link href={`${path}${id}`} passHref>
      <Button sx={{ minWidth: 0, p: 1.25 }}>
        <Icon path={iconName} size={0.75} horizontal vertical rotate={rotate} color="grey" />
        <StyledLink>{title}</StyledLink>
      </Button>
    </Link>
  );
};

// 더보기 버튼 컴포넌트
const RowOptions = () => {
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
    <Fragment>
      <Button sx={{ minWidth: 0, p: 1.25 }} onClick={handleRowOptionsClick}>
        <Icon path={mdiDotsVertical} size={0.75} horizontal vertical rotate={180} color="grey" />
      </Button>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {/* TO DO: excel등록 기능구현 후 link 삽입 */}
        <MenuItem>
          <Icons
            iconName={mdiFileExcel}
            rotate={180}
            path={`/company/list`}
            id={''}
            title={'엑셀 등록'}
          />
        </MenuItem>

        {/* TO DO: 전체단어 등록화면 구현 후 link 삽입 */}
        <MenuItem>
          <Icons
            iconName={mdiNotePlus}
            rotate={180}
            path={`/level_category/list`}
            id={''}
            title={'수기 등록'}
          />
        </MenuItem>
      </Menu>
    </Fragment>
  );
};

// 액션버튼 컴포넌트
const ActionButton = (props: ActionButtonType) => {
  // ** Props
  const { actions, path, id } = props;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {actions === 'edit' ? (
        <Icons iconName={mdiSquareEditOutline} rotate={90} path={`${path}`} id={`${id}`} />
      ) : actions === 'delete' ? (
        <Icons iconName={mdiTrashCanOutline} rotate={180} path={`${path}`} id={`${id}`} />
      ) : actions === 'others' ? (
        <RowOptions />
      ) : null}
    </Box>
  );
};

export default ActionButton;
