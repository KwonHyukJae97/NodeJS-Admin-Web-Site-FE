import { Button } from '@mui/material';
import { SidebarRightType } from 'src/types/apps/calendarTypes';

const SidebarRight = (props: SidebarRightType) => {
  const { handleAddEventSidebarToggle } = props;

  const handleSidebarToggleSidebar = () => {
    handleAddEventSidebarToggle();
  };

  return (
    <Button variant="contained" onClick={handleSidebarToggleSidebar}>
      단어레벨 정보 등록
    </Button>
  );
};

export default SidebarRight;
