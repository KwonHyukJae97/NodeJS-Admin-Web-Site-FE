// ** React Imports
import { useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';

// ** Third Party Imports
import { useForm, Controller } from 'react-hook-form';

// ** Axios Imports
import axios from 'axios';

// 권한테이블에서 사용할 프로퍼티 정의
interface TableHeaderProps {
  value: string;
  handleFilter: (val: string) => void;
}

const TableHeader = (props: TableHeaderProps) => {
  // 권한 데이터 정의
  const dataList = [
    { id: 0, data: 'CREATE' },
    { id: 1, data: 'READ' },
    { id: 2, data: 'UPDATE' },
    { id: 3, data: 'DELETE' },
  ];

  // ** Props
  const { value, handleFilter } = props;

  // ** State
  const [open, setOpen] = useState<boolean>(false),
    [checkedList, setCheckedList] = useState([]);

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 버튼 토글 메소드
  const handleDialogToggle = () => {
    setOpen(!open);
  };

  // 권한 입력 배열 처리 메소드
  const onCheckedElement = (checked, list) => {
    if (checked) {
      setCheckedList([...checkedList, list]);
    } else if (!checked) {
      setCheckedList(checkedList.filter((el) => el !== list));
    }
    checkedList;
  };

  // 데이터 전송 메소드
  const onSubmit = (data) => {
    setOpen(false);
    setValue('menuName', value);
    setValue('grantType', checkedList.join(','));
    console.log(data);

    if (confirm('등록 하시겠습니까?')) {
      axios
        .post('http://localhost:3000/permission', data)
        .then((res) => {
          alert('등록이 완료 되었습니다.');
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  return (
    <>
      <Box
        sx={{
          p: 5,
          pb: 3,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TextField
          size="small"
          value={value}
          sx={{ mr: 4, mb: 2.5 }}
          placeholder="Search Permission"
          onChange={(e) => handleFilter(e.target.value)}
        />
        <Button sx={{ mb: 2.5 }} variant="contained" onClick={handleDialogToggle}>
          Add Permission
        </Button>
      </Box>
      <Dialog fullWidth maxWidth="sm" onClose={handleDialogToggle} open={open}>
        <DialogTitle sx={{ pt: 12, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h4" component="span" sx={{ mb: 2 }}>
            Add New Permission
          </Typography>
          <Typography variant="body2">Permissions you may use and assign to your users.</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 12, mx: 'auto' }}>
          <Box component="form" sx={{ mt: 4 }} onSubmit={handleSubmit(onSubmit)}>
            <FormGroup sx={{ mb: 1 }}>
              <Controller
                name="menuName"
                control={control}
                rules={{ required: true }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    label="Permission Name"
                    onChange={onChange}
                    error={Boolean(errors.name)}
                    placeholder="Enter Permission Name"
                  />
                )}
              />
              {errors.name && (
                <FormHelperText sx={{ color: 'error.main' }}>
                  Please enter a valid permission name
                </FormHelperText>
              )}
            </FormGroup>
            <Typography variant="body2">Grant Type</Typography>
            {dataList.map((list) => (
              <FormControlLabel
                name="grantType"
                control={
                  <Checkbox onChange={(e) => onCheckedElement(e.target.checked, e.target.value)} />
                }
                key={list.id}
                label={list.data}
                value={list.id}
              />
            ))}

            <Box className="demo-space-x" sx={{ '&>:last-child': { mr: 0 } }}>
              <Button size="large" type="submit" variant="contained">
                Create Permission
              </Button>
              <Button
                size="large"
                variant="outlined"
                color="secondary"
                onClick={handleDialogToggle}
              >
                Discard
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TableHeader;
