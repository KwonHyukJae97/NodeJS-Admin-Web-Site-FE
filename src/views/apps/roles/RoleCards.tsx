/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { blue } from '@mui/material/colors';

// ** Third Party Imports
import { Controller, useForm } from 'react-hook-form';

// ** Config
import apiConfig from 'src/configs/api';

// ** axios Imports
import axios from 'axios';

// 역할 리스트 타입 정의
interface RoleType {
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
const arr: permissionType[] = [];

// 권한 체크박스 컴포넌트 타입 정의
interface FormGrantLabelType {
  label: string;
  value: string;
  isChecked: boolean;
  isDisabled: boolean;
}

// 권한에 따른 체크 박스 컴포넌트
const FormGrantLabel = (props: FormGrantLabelType) => {
  // ** Props
  const { label, value, isChecked, isDisabled } = props;

  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          defaultChecked={isChecked}
          disabled={isDisabled}
          sx={{
            color: blue[400],
            '&.Mui-checked': {
              color: blue[400],
            },
          }}
        />
      }
      label={label}
      value={value}
    />
  );
};

const RolesCards = () => {
  // ** States
  const [open, setOpen] = useState<boolean>(false),
    [getData, setGetData] = useState<boolean>(true),
    [isChecked, setIsChecked] = useState<boolean>(false),
    [getAdminInfo, setGetAdminInfo] = useState<string>(''),
    [errMessage, setErrMessage] = useState<string>(''),
    [dialogTitle, setDialogTitle] = useState<'등록' | '수정' | '보기'>('등록'),
    [cardData, setCardData] = useState<any[]>([]),
    [viewData, setViewData] = useState<any>([]),
    [permissionData, setPermissionData] = useState<any[]>([]),
    [roleId, setRoleId] = useState(0),
    [title, setTitle] = useState('');

  // 권한 데이터 정의
  const dataList = [
    { value: '0', type: '등록' },
    { value: '1', type: '조회' },
    { value: '2', type: '수정' },
    { value: '3', type: '삭제' },
  ];

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: '' } });

  // 버튼 열기
  const handleClickOpen = (action: string, roleId: number) => {
    setOpen(true);
    if (action === '수정') {
      getDetailPermission();
      getDetailRole(roleId, '');
    }
    if (action === '보기') {
      getDetailRole(roleId, '');
    }
    if (action === '등록') {
      getDetailPermission();
    }
    if (action === '사용자보기') {
      setGetAdminInfo('Y');
      getDetailRole(roleId, 'Y');
    }
  };

  // 버튼 닫기
  const handleClose = () => {
    setOpen(false);
    setValue('roleName', '');
    setGetAdminInfo('');
    setViewData([]);
    setIsChecked(false);
    setErrMessage('');
  };

  // 권한 타입 checkBox 처리
  const onCheckedType = (isChecked: boolean, value: string, permission: permissionType) => {
    setIsChecked(true);
    setErrMessage('');
    if (value == '0') {
      permission.isWrite = isChecked;
    } else if (value == '1') {
      permission.isRead = isChecked;
    } else if (value == '2') {
      permission.isUpdate = isChecked;
    } else if (value == '3') {
      permission.isDelete = isChecked;
    }
  };

  const onSubmit = (data: any) => {
    let getRoleName = data.roleName;

    if (getRoleName === '') {
      getRoleName = title;
    }
    const roleData: any = {
      roleName: getRoleName,
      roleDto: [],
    };

    permissionData.forEach((value: permissionType) => {
      let type = '';

      const pushData = () => {
        roleData.roleDto.push({
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
    if (isChecked == false) {
      setErrMessage('역할을 한개 이상 체크해주세요.');

      return false;
    }
    const filterName = cardData.filter((filterData) => {
      return filterData.title == getRoleName && filterData.roleId != roleId;
    });

    if (filterName.length > 0) {
      setErrMessage('이미 중복된 역할이름이 있습니다.');

      return false;
    } else {
      if (dialogTitle == '등록') {
        getRoleName = data.roleName;
        createRole(roleData);
      } else if (dialogTitle == '수정') {
        updateRole(roleData, roleId);
      }
    }
    handleClose();
  };

  // 역할 리스트 조회 API호출
  const getAllRole = async () => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/role`);
      const roleMap = new Map<number, RoleType>();

      res.data.forEach((role: { roleName: string; adminCount: number; roleId: any }) => {
        if (!roleMap.has(role.roleId)) {
          const card: RoleType = {
            roleId: role.roleId,
            title: role.roleName,
            avatars: ['3.png'],
            totalUsers: role.adminCount,
          };
          roleMap.set(role.roleId, card);
          setTitle(role.roleName);
        } else {
          const card = roleMap.get(role.roleId)!;
          card.avatars.push('4.png');
          card.totalUsers++;
        }
      });
      const cardDataList: RoleType[] = [];
      roleMap.forEach((value) => {
        cardDataList.push(value);
      });
      setCardData(cardDataList);
    } catch (err) {
      console.log(err);
    }
  };

  // 화면 이름(권한) 데이터 조회 API호출
  const getDetailPermission = async () => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/permission`);
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
    } catch (err) {
      console.log(err);
    }
  };

  // 역할 등록 API호출
  const createRole = async (roleData: any) => {
    setErrMessage('');
    if (confirm('등록 하시겠습니까?')) {
      try {
        const req = await axios.post(`${apiConfig.apiEndpoint}/role`, {
          roleName: roleData.roleName,
          roleDto: roleData.roleDto,

          // TO DO : companyId 필터링적용 후 수정 필요
          companyId: 3,
        });
        alert('등록이 완료 되었습니다.');
        location.reload();
      } catch (err) {
        console.log(err);
        alert('등록에 실패하였습니다.');
      }
    }
  };

  // 역할 수정 API호출
  const updateRole = async (roleData: any, roleId: number) => {
    if (confirm('수정 하시겠습니까?')) {
      try {
        const req = await axios.patch(`${apiConfig.apiEndpoint}/role/${roleId}`, roleData);
        alert('수정이 완료 되었습니다.');
        location.reload();
      } catch (err: any) {
        console.log('err', err.response.data);
        alert('수정에 실패 하였습니다.');
      }
    }
  };

  // 역할 삭제 API호출
  // To Do : 추후 권한 처리 적용 후 삭제 권한자만 보일 수 있도록 수정해야함
  const deleteRole = async (roleId: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      try {
        await axios.delete(`${apiConfig.apiEndpoint}/role/${roleId}`);
        alert('삭제가 완료 되었습니다.');
        location.reload();
      } catch (err) {
        console.log(err);
      }
    }
  };

  // 역할 상세 정보 조회 API호출
  const getDetailRole = async (roleId: number, getInfo: string) => {
    try {
      const res = await axios.get(`${apiConfig.apiEndpoint}/role/${roleId}`, {
        params: { getInfo: getInfo },
      });
      setViewData(res.data);
      setGetData(true);
    } catch (err) {
      if (err) {
        console.log('message:', err);
        setGetData(false);
      }
    }
  };

  // 권한에 따른 역할 상세정보 체크박스 활성화 표시
  const isCheckedGrantType = (receiveGrantTypeList: [], grantType: string) => {
    const filterLength = receiveGrantTypeList.filter((receiveGrantType: { grant_type: string }) => {
      return receiveGrantType.grant_type == grantType;
    }).length;

    return filterLength > 0;
  };

  // Role List 불러오기
  useEffect(() => {
    getAllRole();
  }, []);

  // useState 비동기 문제 해결을 위한 useEffect 사용

  useEffect(() => {}, [roleId]);
  useEffect(() => {}, [title]);
  useEffect(() => {}, [viewData]);

  // 역할 리스트 출력
  const renderCards = () =>
    cardData.map((item, index: number) => (
      <Grid item xs={12} sm={6} lg={4} key={index}>
        <Card>
          <CardContent>
            <Box
              sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography
                variant="body2"
                sx={{ cursor: 'pointer' }}
                onClick={() => {
                  setGetAdminInfo('Y');
                  setDialogTitle('보기');
                  handleClickOpen('사용자보기', item.roleId);
                }}
              >
                등록된 사용자: {item.totalUsers} 명
              </Typography>
              {/* <AvatarGroup
                max={4}
                sx={{
                  '& .MuiAvatarGroup-avatar': { fontSize: '.875rem' },
                  '& .MuiAvatar-root, & .MuiAvatarGroup-avatar': { width: 40, height: 40 },
                }}
              >
                {item.avatars.map((img: any, index: number) => (
                  <Avatar key={index} alt={item.title} src={`/images/avatars/${img}`} />
                ))}
              </AvatarGroup> */}
            </Box>
            <Box>
              <Typography
                variant="h6"
                sx={{ color: 'text.secondary', cursor: 'pointer' }}
                onClick={() => {
                  setRoleId(item.roleId);
                  setTitle(item.title);
                  handleClickOpen('보기', item.roleId);
                  setDialogTitle('보기');
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
                  handleClickOpen('수정', item.roleId);
                  setDialogTitle('수정');
                }}
              >
                수정하기
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  deleteRole(item.roleId);
                }}
              >
                <DeleteOutline />
              </IconButton>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    ));

  return (
    <Grid container spacing={6} className="match-height">
      {renderCards()}
      <Grid item xs={12} sm={6} lg={4}>
        <Card
          sx={{ cursor: 'pointer' }}
          onClick={() => {
            handleClickOpen('등록', 0);
            setDialogTitle('등록');
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
                      handleClickOpen('등록', 0);
                      setDialogTitle('등록');
                    }}
                  >
                    등록하기
                  </Button>
                  <Typography variant="body2">
                    새로운 역할을 등록하시려면 등록하기 버튼을 눌러주세요.
                  </Typography>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Grid>
      <Dialog fullWidth maxWidth="md" scroll="body" onClose={handleClose} open={open}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle sx={{ textAlign: 'center', mt: 5 }}>
            {getAdminInfo === 'Y' ? (
              <Typography variant="h4" component="span">
                {`사용자 ${dialogTitle}`}
              </Typography>
            ) : (
              <Typography variant="h4" component="span">
                {`역할 ${dialogTitle}`}
              </Typography>
            )}
          </DialogTitle>
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <Box sx={{ my: 4 }}>
              <FormControl>
                {dialogTitle === '수정' ? (
                  <Controller
                    name="roleName"
                    control={control}
                    rules={{ required: false }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label={`${title}`}
                        onChange={onChange}
                        error={Boolean()}
                      />
                    )}
                  />
                ) : dialogTitle === '등록' ? (
                  <Controller
                    name="roleName"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        value={value}
                        label={'역할 이름'}
                        onChange={onChange}
                        error={Boolean(errors.roleName)}
                      />
                    )}
                  />
                ) : (dialogTitle === '보기' && getAdminInfo === 'Y') ||
                  dialogTitle === '보기' ||
                  dialogTitle === '수정' ? (
                  <Typography variant="h6">{title}</Typography>
                ) : null}
                {dialogTitle === '등록' && errors.roleName && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    역할 이름을 입력해 주세요.
                  </FormHelperText>
                )}
              </FormControl>
            </Box>

            <TableContainer>
              <Table size="small">
                {dialogTitle === '보기' && getData === true && getAdminInfo === '' ? (
                  <TableHead>
                    <TableRow sx={{ pl: '2rem' }}>
                      <TableCell align="center">
                        <Box
                          sx={{
                            fontSize: '1.0rem',
                            alignItems: 'center',
                            textTransform: 'capitalize',
                          }}
                        >
                          권한 이름
                        </Box>
                      </TableCell>
                      <TableCell colSpan={4}>권한 종류</TableCell>
                    </TableRow>
                  </TableHead>
                ) : dialogTitle === '보기' && getAdminInfo === 'Y' ? (
                  <TableHead>
                    <TableRow>
                      <TableCell> 번호 </TableCell>
                      <TableCell> 사용자 ID </TableCell>
                      <TableCell> 사용자 이름 </TableCell>
                    </TableRow>
                  </TableHead>
                ) : null}

                {dialogTitle === '보기' && getData === true && getAdminInfo === '' ? (
                  <TableBody>
                    {viewData.map((data: any, index: number) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& .MuiTableCell-root:first-of-type': { pl: 0 } }}
                        >
                          <TableCell align="center">{data.display_name}</TableCell>

                          {dataList.map((list, dataListIndex) => (
                            <TableCell align="center" key={dataListIndex}>
                              <FormGrantLabel
                                label={list.type}
                                value={list.value}
                                isChecked={isCheckedGrantType(data.grant_type_list, list.value)}
                                isDisabled={true}
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : dialogTitle === '보기' && getAdminInfo === 'Y' ? (
                  <TableBody>
                    {viewData.map((data: any, index: number) => {
                      return (
                        <TableRow
                          key={index}
                          sx={{ '& .MuiTableCell-root:first-of-type': { pl: -1 } }}
                        >
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">{data.id}</TableCell>
                          <TableCell align="center">{data.adminName}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : null}

                {dialogTitle === '등록' || dialogTitle === '수정' ? (
                  <TableBody>
                    {permissionData.map((permission, index: number) => {
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
                            {permission.displayName}
                          </TableCell>

                          <TableCell key={index} colSpan={4}>
                            {dataList.map((list) => (
                              <FormControlLabel
                                name="grantType"
                                control={
                                  <Checkbox
                                    size="small"
                                    onChange={(e) =>
                                      onCheckedType(e.target.checked, e.target.value, permission)
                                    }
                                  />
                                }
                                key={list.value}
                                label={list.type}
                                value={list.value}
                                sx={{ paddingInline: 3, marginInlineStart: 3 }}
                              />
                            ))}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                ) : null}
              </Table>
            </TableContainer>
            <Box>
              <Typography variant="body1" pt={3} sx={{ color: 'error.main' }}>
                {' '}
                {errMessage}
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
            {dialogTitle != '보기' ? (
              <Box className="demo-space-x">
                <Button size="large" type="submit" variant="contained">
                  등록
                </Button>
                <Button size="large" color="secondary" variant="outlined" onClick={handleClose}>
                  취소
                </Button>
              </Box>
            ) : (
              <Box className="demo-space-x">
                <Button size="large" variant="outlined" onClick={handleClose}>
                  확인
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
