// ** MUI Imports
import Icon from '@mdi/react';

// ** Icons Imports
import {
  mdiPencilPlus,
  mdiMagnifyPlusOutline,
  mdiPencil,
  mdiCursorPointer,
  mdiPlusCircleOutline,
  mdiMinusCircleOutline,
} from '@mdi/js';
import Button from '@mui/material/Button';

// 마우스 오버 핸들링 버튼 타입 정의
interface MouseOverHandleButtonType {
  actions: 'add' | 'remove' | 'edit' | 'view' | 'inputLine' | 'recommend';
}

// 마우스 오버 핸들링 버튼 컴포넌트
const MouseOverHandleButton = (props: MouseOverHandleButtonType) => {
  // ** Props
  const { actions } = props;

  return (
    <Button sx={{ display: 'inline', minWidth: 0, p: 1.25 }}>
      {actions === 'add' ? (
        <Icon path={mdiPlusCircleOutline} size={1} color="grey" />
      ) : actions === 'remove' ? (
        <Icon path={mdiMinusCircleOutline} size={1} color="grey" />
      ) : actions === 'edit' ? (
        <Icon path={mdiPencil} size={1} color="grey" />
      ) : actions === 'view' ? (
        <Icon path={mdiMagnifyPlusOutline} size={1} color="grey" />
      ) : actions === 'inputLine' ? (
        <Icon path={mdiPencilPlus} size={1} color="grey" />
      ) : actions === 'recommend' ? (
        <Icon path={mdiCursorPointer} size={1} color="grey" />
      ) : null}
    </Button>
  );
};

export default MouseOverHandleButton;
