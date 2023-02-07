// import { Button } from '@mui/material';
// import { mdiSquareEditOutline, mdiTrashCanOutline } from '@mdi/js';
import { MdSystemUpdateAlt } from 'react-icons/md';
import { SidebarEditType } from 'src/types/apps/calendarTypes';

const SidebarEdit = (props: SidebarEditType) => {
  const { handleEditEventSidebarToggle } = props;

  const handleSidebarToggleSidebarEdit = () => {
    handleEditEventSidebarToggle();
  };

  return <MdSystemUpdateAlt onClick={handleSidebarToggleSidebarEdit} />;
};

export default SidebarEdit;
