// ** React Imports
import { SetStateAction, useEffect, useState } from 'react';

// ** MUI Imports
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form';

// ** axios Imports
import axios from 'axios';

interface CardDataType {
  roleId: number;
  title: string;
  avatars: string[];
  totalUsers: number;
}

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit'>('Add');
  const [cardData, setCardData] = useState<any[]>([]);
  const [grantType, setGrantType] = useState('');

  // 권한 데이터 정의
  const dataList = [
    { id: 0, data: 'Write' },
    { id: 1, data: 'Read' },
    { id: 2, data: 'Update' },
    { id: 3, data: 'Delete' },
  ];

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleClickOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setValue('roleName', '');
    setValue('grantType', '');
  };

  //role 데이터 불러오기
  useEffect(() => {
    axios
      .get('http://localhost:3000/role')
      .then((res) => {
        const roleMap = new Map<number, CardDataType>();
        res.data.forEach((role: { roleName: string; roleId: any }) => {
          if (!roleMap.has(role.roleId)) {
            const card: CardDataType = {
              roleId: role.roleId,
              title: role.roleName,
              avatars: ['3.png'],
              totalUsers: 1,
            };
            roleMap.set(role.roleId, card);
          } else {
            const card = roleMap.get(role.roleId)!;
            card.avatars.push('4.png');
            card.totalUsers++;
          }
        });

        const cardDataList: CardDataType[] = [];
        roleMap.forEach((value) => {
          cardDataList.push(value);
        });
        setCardData(cardDataList);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // 화면(권한)이름 정의
  const rolesArr = [
    'User Management',
    'Content Management',
    'Disputes Management',
    'Database Management',
    'Financial Management',
    'Reporting',
    'API Control',
    'Repository Management',
    'Payroll',
  ];

  const renderCards = () =>
    cardData.map((item, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography variant="body2">Total {item.totalUsers} users</Typography>
              <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatarGroup-avatar': { fontSize: '.875rem' },
                  '& .MuiAvatar-root, & .MuiAvatarGroup-avatar': { width: 40, height: 40 },
                }}
              >
                {item.avatars.map((img: any, index: number) => (
                  <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup>
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                {item.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', cursor: 'pointer' }}
                onClick={() => {
                  handleClickOpen();
                  setDialogTitle('Edit');
                }}
              >
                Edit Role
              </Typography>
              {/* <IconButton size="small">
                <ContentCopy />
              </IconButton> */}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  // 권한 타입 checkBox 처리
  const onCheckedType = (value: SetStateAction<string>) => {
    console.log('checked value:', value);
    setGrantType(value);
  };

  // useState(grantType) 비동기 문제를 위한 useEffect 사용
  useEffect(() => {
    console.log('grantType?', grantType);
  }, [grantType]);

  // 역할 등록
  const onSubmit = (data: any) => {
    setValue('grantType', grantType);
    setValue('roleName', data.roleName);

    if (confirm('등록 하시겠습니까?')) {
      axios
        .post('http://localhost:3000/role', {
          roleName: data.roleName,
          grantType: grantType,

          // TO DO : companyId 필터링적용 후 수정 필요
          companyId: 3,
          permissionId: 8,
        })
        .then((res) => {
          console.log(res.data);
          alert('등록이 완료 되었습니다.');
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
    handleClose();
  };

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen();
            setDialogTitle('Add');
          }}
        >
          <Grid container sx={{ height: '100%' }}>
            <Grid item xs={5}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
              >
                <img width={65} height={130} alt="add-role" src="/images/cards/pose_m1.png" />
              </Box>
            </Grid>
            <Grid item xs={7}>
              <CardContent>
                <Box sx={{ textAlign: 'right' }}>
                  <Button
                    variant="contained"
                    sx={{ mb: 2.5, whiteSpace: 'nowrap' }}
                    onClick={() => {
                      handleClickOpen();
                      setDialogTitle('Add');
                    }}
                  >
                    Add Role
                  </Button>
                  <Typography variant="body2">Add role, if it doesn't exist.</Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Dialog fullWidth maxWidth="md" scroll="body" onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ textAlign: 'center' }}>
            <Typography variant="h4" component="span">
              {`${dialogTitle} Role`}
            </Typography>
            <Typography variant="body2">Set Role Permissions</Typography>
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            {`${dialogTitle}` === 'Add' ? (
              <Box sx={{ my: 4 }}>
                <FormControl fullWidth>
                  <Controller
                    name="roleName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label="Role Name"
                        onChange={onChange}
                        error={Boolean(errors.name)}
                        placeholder="Enter Role Name"
                      />
                    )}
                  />
                  {errors.name && (
                    <FormHelperText sx={{ color: 'error.main' }}>
                      Please enter a valid role name
                    </FormHelperText>
                  )}
                </FormControl>
              </Box>
            ) : null}
            <Typography variant="h6">Role Permissions</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {/* <TableCell sx={{ pl: '0 !important' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          fontSize: '0.875rem',
                          alignItems: 'center',
                          textTransform: 'capitalize'
                        }}
                      >
                        Administrator Access
                        <Tooltip placement='top' title='Allows a full access to the system'>
                          <InformationOutline sx={{ ml: 1, fontSize: '1rem' }} />
                        </Tooltip>
                      </Box>
                    </TableCell> 
                    <TableCell colSpan={3}>
                      <FormControlLabel
                        label="Select All"
                        control={<Checkbox size="small" />}
                        sx={{ '& .MuiTypography-root': { textTransform: 'capitalize' } }}
                      />
                    </TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rolesArr.map((i, index: number) => {
                    return (
                      <TableRow
                        key={index}
                        sx={{ '& .MuiTableCell-root:first-of-type': { pl: 0 } }}
                      >
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: (theme) => `${theme.palette.text.primary} !important`,
                          }}
                        >
                          {i}
                        </TableCell>
                        <TableCell>
                          {dataList.map((list) => (
                            <FormControlLabel
                              name="grantType"
                              control={
                                <Checkbox
                                  size="small"
                                  onChange={(e) => onCheckedType(e.target.value)}
                                />
                              }
                              key={list.id}
                              label={list.data}
                              value={list.id}
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
            <Box className="demo-space-x">
              <Button size="large" type="submit" variant="contained">
                Submit
              </Button>
              <Button size="large" color="secondary" variant="outlined" onClick={handleClose}>
                Discard
              </Button>
            </Box>
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
};

export default RolesCards;
