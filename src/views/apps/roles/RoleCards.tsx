/* eslint-disable @typescript-eslint/no-empty-function */
// ** React Imports
import { useEffect, useState } from 'react';

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
import { DeleteOutline } from 'mdi-material-ui';
import { IconButton } from '@mui/material';

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form';

// ** axios Imports
import axios from 'axios';

import moment from 'moment';

// 역할 리스트 타입 정의
interface CardDataType {
  roleId: number;
  title: string;
  avatars: string[];
  totalUsers: number;
}

// 권한 타입 정의
interface permissionType {
  permissionId: number;
  displayName: string;
  isWrite: boolean;
  isRead: boolean;
  isUpdate: boolean;
  isDelete: boolean;
  grantType: string;
}

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false),
    [getData, setGetData] = useState<boolean>(true),
    [dialogTitle, setDialogTitle] = useState<'Add' | 'Edit' | 'View'>('Add'),
    [cardData, setCardData] = useState<any[]>([]),
    [viewData, setViewData] = useState<any>({}),
    [permissionData, setPermissionData] = useState<any[]>([]),
    [grantType, setGrantType] = useState<any[]>([]),
    [permissionId, setPermissionId] = useState(0),
    [roleId, setRoleId] = useState(0),
    [title, setTitle] = useState(''),
    [checkedItem, setCheckedItem] = useState(new Set()),
    [permissionMap, setPermissionMap] = useState(new Map<number, permissionType>());

  // 권한 데이터 정의
  const dataList = [
    { value: '0', type: 'Write' },
    { value: '1', type: 'Read' },
    { value: '2', type: 'Update' },
    { value: '3', type: 'Delete' },
  ];

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // 버튼 열기
  const handleClickOpen = (action: string, roleId: number) => {
    setOpen(true);
    if (action === 'Edit') {
      getPermissionData();
      getRoleView(roleId);
    }
    if (action === 'View') {
      getRoleView(roleId);
    }
  };

  // 버튼 닫기
  const handleClose = () => {
    setOpen(false);
    setValue('roleName', '');
    checkedItem.clear();
  };

  // 삭제 처리
  // To Do : 추후 권한 처리 적용 후 삭제 권한자만 보일 수 있도록 수정해야함
  const handleDeleteClick = (roleId: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      axios
        .delete(`http://localhost:3000/role/${roleId}`)
        .then(() => {
          alert('삭제가 완료 되었습니다.');
          location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
            setTitle(role.roleName);
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

  // 화면 이름(권한) 데이터 불러오기
  const getPermissionData = () => {
    axios
      .get('http://localhost:3000/permission')
      .then((res) => {
        const permissionMap = new Map<number, permissionType>();
        res.data.forEach((permission: { displayName: string; permissionId: number }) => {
          if (!permissionMap.has(permission.permissionId)) {
            const permissionData: permissionType = {
              permissionId: permission.permissionId,
              displayName: permission.displayName,
              isWrite: false,
              isDelete: false,
              isUpdate: false,
              isRead: false,
              grantType: '',
            };
            permissionMap.set(permission.permissionId, permissionData);
          }
        });
        const permissionDataList: permissionType[] = [];
        permissionMap.forEach((value) => {
          permissionDataList.push(value);
        });
        setPermissionData(permissionDataList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 역할 상세 정보 불러오기
  const getRoleView = (roleId: number) => {
    axios
      .get(`http://localhost:3000/role/${roleId}`)
      .then((res) => {
        setViewData(res.data);
        setGetData(true);
      })
      .catch((err) => {
        if (err.response.data) {
          console.log('message:', err.response.data);
          setGetData(false);
        }
      });
  };

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
              <Typography
                variant="h6"
                sx={{ color: 'text.secondary', cursor: 'pointer' }}
                onClick={() => {
                  setRoleId(item.roleId);
                  setTitle(item.title);
                  handleClickOpen('View', item.roleId);
                  setDialogTitle('View');
                }}
              >
                {item.title}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                variant="body2"
                sx={{ color: 'primary.main', cursor: 'pointer' }}
                onClick={() => {
                  setRoleId(item.roleId);
                  setTitle(item.title);
                  handleClickOpen('Edit', item.roleId);
                  setDialogTitle('Edit');
                }}
              >
                Edit Role
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  handleDeleteClick(item.roleId);
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  // 권한 타입 checkBox 처리
  const onCheckedType = (isChecked: boolean, value: string, permission: permissionType) => {
    if (isChecked) {
      if (value == '0') {
        permission.isWrite = isChecked;
      } else if (value == '1') {
        permission.isRead = isChecked;
      } else if (value == '2') {
        permission.isUpdate = isChecked;
      } else if (value == '3') {
        permission.isDelete = isChecked;
      }
      console.log(isChecked, value, permission);
    }

    // // 체크박스에 체크 되었을 때 값 저장
    // if (isChecked) {
    //   checkedItem.add(value);
    //   setCheckedItem(checkedItem);

    //   // 체크 안됨&체크박스 두번 누를 경우 중복데이터 삭제 후 값 저장
    // } else if (!isChecked && checkedItem.has(value)) {
    //   checkedItem.delete(value);
    //   setCheckedItem(checkedItem);
    // }

    // // Set을 Array타입으로 변환
    // setGrantType(Array.from(checkedItem));
  };

  // useState 비동기 문제 해결을 위한 useEffect 사용
  useEffect(() => {}, [grantType]);
  useEffect(() => {}, [roleId]);
  useEffect(() => {}, [title]);

  const onSubmit = (data: any) => {
    if (dialogTitle == 'Add') {
      registerRole(data);
    } else if (dialogTitle == 'Edit') {
      updateRole(data.roleName, roleId);
    }
    handleClose();
  };

  // 역할 등록
  const registerRole = (data: { roleName: any }) => {
    if (confirm('등록 하시겠습니까?')) {
      axios
        .post('http://localhost:3000/role', {
          roleName: data.roleName,
          grantType: grantType,
          permissionId: permissionId,

          // TO DO : companyId 필터링적용 후 수정 필요
          companyId: 3,
        })
        .then((res) => {
          console.log(res.data);
          alert('등록이 완료 되었습니다.');
          location.reload();
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };

  // 역할 수정
  const updateRole = (roleName: string, roleId: number) => {
    const updateFetchData = {
      roleName: roleName,
      roleDto: [],
    };
    console.log('permissionData', permissionData);
    permissionData.forEach((value: permissionType) => {
      let type = '';

      const pushData = () => {
        updateFetchData.roleDto.push({
          permissionId: value.permissionId,
          grantType: type,
        });
      };

      if (value.isWrite == true) {
        type = '0';
        pushData();
      }
      if (value.isRead == true) {
        type = '1';
        pushData();
      }
      if (value.isUpdate == true) {
        type = '2';
        pushData();
      }
      if (value.isDelete == true) {
        type = '3';
        pushData();
      }
    });

    console.log(updateFetchData);

    if (confirm('수정 하시겠습니까?')) {
      axios
        .patch(`http://localhost:3000/role/${roleId}`, updateFetchData)
        .then((res) => {
          console.log(res.data);
          alert('수정이 완료 되었습니다.');
          location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen('Add', 0);
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
                      handleClickOpen('Add', 0);
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
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <Box sx={{ my: 4 }}>
              <FormControl>
                {dialogTitle != 'View' ? (
                  <Controller
                    name="roleName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label={`${title}`}
                        onChange={onChange}
                        error={Boolean(errors.roleName)}
                        defaultValue={`${title}`}
                        placeholder="Enter Role Name"
                      />
                    )}
                  />
                ) : (
                  <Typography variant="h6">{title}</Typography>
                )}
                {errors.roleName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    Please enter a valid role name
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            {/* {dialogTitle != 'View' ? (
              <Typography variant="h6">Role Permissions</Typography>
            ) : (
              <Typography variant="h6">{title}</Typography>
            )} */}
            <TableContainer>
              <Table size="small">
                {dialogTitle === 'View' && getData === true ? (
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ pl: '0 !important' }}>
                        <Box
                          sx={{
                            display: 'flex',
                            fontSize: '0.875rem',
                            alignItems: 'center',
                            textTransform: 'capitalize',
                          }}
                        >
                          Permission Name
                        </Box>
                      </TableCell>
                      <TableCell>Grant Type</TableCell>
                      <TableCell>Register Date</TableCell>
                      <TableCell>Update Date</TableCell>
                    </TableRow>
                  </TableHead>
                ) : null}
                {dialogTitle === 'View' && getData === true ? (
                  <TableBody>
                    <TableRow sx={{ '& .MuiTableCell-root:first-of-type': { pl: 0 } }}>
                      <TableCell>{viewData.P_display_name}</TableCell>
                      <TableCell>
                        {`${viewData.RP_grant_type}` === '0'
                          ? 'Write'
                          : `${viewData.RP_grant_type}` === '1'
                          ? 'Read'
                          : `${viewData.RP_grant_type}` === '2'
                          ? 'Update'
                          : `${viewData.RP_grant_type}` === '3'
                          ? 'Delete'
                          : null}
                      </TableCell>
                      {`${viewData.RP_reg_date}` !== null ? (
                        <TableCell>
                          {moment(`${viewData.RP_reg_date}`).format('YYYY-MM-DD HH:mm')}
                        </TableCell>
                      ) : null}
                      {`${viewData.RP_update_date}` !== null ? (
                        <TableCell>
                          {moment(`${viewData.RP_update_date}`).format('YYYY-MM-DD HH:mm')}
                        </TableCell>
                      ) : null}
                    </TableRow>
                  </TableBody>
                ) : dialogTitle === 'View' ? (
                  <Typography variant="h6">등록된 정보가 없습니다.</Typography>
                ) : null}
                {dialogTitle != 'View' ? (
                  <TableBody>
                    {
                      permissionData.map((i, index: number) => {
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
                              {i.displayName}
                            </TableCell>
                            <TableCell>
                              {dataList.map((list) => (
                                <FormControlLabel
                                  name="grantType"
                                  control={
                                    <Checkbox
                                      size="small"
                                      onChange={(e) =>
                                        onCheckedType(e.target.checked, e.target.value, i)
                                      }
                                    />
                                  }
                                  key={list.value}
                                  label={list.type}
                                  value={list.value}
                                />
                              ))}
                            </TableCell>
                          </TableRow>
                        );
                      })

                      // permissionData.map((i, index: number) => {
                      //   return (
                      //     <TableRow
                      //       onClick={(event) => handleClick(event, i.permissionId)}
                      //       key={index}
                      //       sx={{ '& .MuiTableCell-root:first-of-type': { pl: 0 } }}
                      //     >
                      //       <TableCell
                      //         sx={{
                      //           fontWeight: 600,
                      //           color: (theme) => `${theme.palette.text.primary} !important`,
                      //         }}
                      //       >
                      //         {i.displayName}
                      //       </TableCell>

                      //       <TableCell>
                      //         {dataList.map((list) => (
                      //           <FormControlLabel
                      //             name="grantType"
                      //             control={
                      //               <Checkbox
                      //                 size="small"
                      //                 onChange={(e) =>
                      //                   onCheckedType(e.target.checked, e.target.value)
                      //                 }
                      //               />
                      //             }
                      //             key={list.value}
                      //             label={list.type}
                      //             value={list.value}
                      //           />
                      //         ))}
                      //       </TableCell>
                      //     </TableRow>
                      //   );
                      // })
                    }
                  </TableBody>
                ) : null}
              </Table>
            </TableContainer>
          </DialogContent>
          <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
            {dialogTitle != 'View' ? (
              <Box className="demo-space-x">
                <Button size="large" type="submit" variant="contained">
                  Submit
                </Button>
                <Button size="large" color="secondary" variant="outlined" onClick={handleClose}>
                  Discard
                </Button>
              </Box>
            ) : (
              <Box className="demo-space-x">
                <Button size="large" variant="outlined" onClick={handleClose}>
                  Discard
                </Button>
              </Box>
            )}
          </DialogActions>
        </form>
      </Dialog>
    </Grid>
  );
};

export default RolesCards;
