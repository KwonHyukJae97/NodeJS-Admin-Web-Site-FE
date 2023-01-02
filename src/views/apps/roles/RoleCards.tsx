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
import authConfig from 'src/configs/auth';

// ** axios Imports
import Api from 'src/utils/api';

// 역할 리스트 타입 정의
interface RoleType {
  roleId: number;
  title: string;
  avatars: string[];
  totalUsers: number;
}

// 권한 타입 정의
interface permissionType {
  grantTypeList: any;
  dataChange: boolean;
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
  displayPermission: any;
}

// 역할 TableBody 컴포넌트 타입 정의
interface FormGrantTableRowType {
  index: number;
  displayPermission: any;
  checkedPermissionDataList: [];
  dataList: { value: string; type: string }[];
  isShowOnlyChecked: boolean;
  isChecked: boolean;
  isDisabled: boolean;
  isDialogShow: boolean;
}

const RolesCards = () => {
  // ** States
  const [dialogRoleViewOpen, setDialogRoleViewOpen] = useState<boolean>(false),
    [dialogRoleRegisterOpen, setDialogRoleRegisterOpen] = useState<boolean>(false),
    [dialogRoleUserViewOpen, setDialogRoleUserViewOpen] = useState<boolean>(false),
    [dialogRoleUpdateOpen, setDialogRoleUpdateOpen] = useState<boolean>(false),
    [isChecked, setIsChecked] = useState<boolean>(false),
    [isDataChange, setIsDataChange] = useState<boolean>(false),
    [errMessage, setErrMessage] = useState<string>(''),
    [dialogTitle, setDialogTitle] = useState<'등록' | '수정' | '보기'>('등록'),
    [cardData, setCardData] = useState<any[]>([]),
    [viewData, setViewData] = useState<any>([]),
    [permissionData, setPermissionData] = useState<any[]>([]),
    [roleId, setRoleId] = useState(0),
    [title, setTitle] = useState('');

  // 권한(grantType) 데이터 정의
  const dataList = [
    { value: '0', type: '등록' },
    { value: '1', type: '조회' },
    { value: '2', type: '수정' },
    { value: '3', type: '삭제' },
  ];

  //로그인 한 사용자 아이디 가져오기
  const userData = window.localStorage.getItem(authConfig.storageUserDataKeyName)!;
  const resData = JSON.parse(userData);

  // ** Hooks
  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { roleName: '' } });

  // 권한에 따른 체크 박스 컴포넌트
  const FormGrantLabel = (props: FormGrantLabelType) => {
    // ** Props
    const { label, value, isChecked, isDisabled, displayPermission } = props;

    return (
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            defaultChecked={isChecked || false}
            disabled={isDisabled}
            onChange={(e) => onCheckedType(e.target.checked, e.target.value, displayPermission)}
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

  // 모달 타이틀 컴포넌트
  const modalTitle = (modalTitleName: string) => {
    return (
      <DialogTitle sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h4" component="span">
          {modalTitleName}
        </Typography>
      </DialogTitle>
    );
  };

  const tableHead = () => {
    return (
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
    );
  };

  // 모달 버튼 컴포넌트
  const modalButton = (action: string) => {
    return (
      <DialogActions sx={{ pt: 0, display: 'flex', justifyContent: 'center' }}>
        <Box className="demo-space-x">
          {action == 'submit' ? (
            <>
              <Button size="large" type="submit" variant="contained">
                등록
              </Button>
              <Button size="large" color="secondary" variant="outlined" onClick={handleClose}>
                취소
              </Button>
            </>
          ) : (
            <Button size="large" variant="outlined" onClick={handleClose}>
              확인
            </Button>
          )}
        </Box>
      </DialogActions>
    );
  };

  // 역할 이름 입력창 컴포넌트
  const grantNameInput = (label: string, rules: boolean, error: boolean | undefined) => {
    return (
      <FormControl>
        <Controller
          name="roleName"
          control={control}
          rules={{ required: rules }}
          render={({ field: { value, onChange } }) => (
            <TextField value={value} label={label} onChange={onChange} error={error} />
          )}
        />
        {errors.roleName && (
          <FormHelperText sx={{ color: 'error.main' }}>역할 이름을 입력해 주세요.</FormHelperText>
        )}
      </FormControl>
    );
  };

  // 역할 등록/수정 테이블 컴포넌트
  const grantInputTablebody = () => {
    return (
      <>
        <TableContainer>
          <Table size="small">
            {tableHead()}
            <TableBody>
              {permissionData.map((data: any, index: number) => {
                return (
                  <FormGrantTableRow
                    key={index}
                    index={index}
                    displayPermission={data}
                    checkedPermissionDataList={viewData}
                    dataList={dataList}
                    isShowOnlyChecked={false}
                    isChecked={true}
                    isDisabled={false}
                    isDialogShow={dialogRoleRegisterOpen || dialogRoleUpdateOpen}
                  />
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box>
          <Typography variant="body1" pt={3} sx={{ color: 'error.main' }}>
            {' '}
            {errMessage}
          </Typography>
        </Box>
      </>
    );
  };

  // 역할 보기 테이블 컴포넌트
  const grantTablebody = (viewData: any, dataList: any) => {
    return (
      <>
        {tableHead()}
        <TableBody>
          {viewData.map((data: any, index: number) => {
            return (
              <FormGrantTableRow
                key={index}
                index={index}
                displayPermission={data}
                checkedPermissionDataList={viewData}
                dataList={dataList}
                isShowOnlyChecked={true}
                isChecked={true}
                isDisabled={true}
                isDialogShow={dialogRoleViewOpen}
              />
            );
          })}
        </TableBody>
      </>
    );
  };

  // TableBody checkBox 처리
  const FormGrantTableRow = (props: FormGrantTableRowType) => {
    // ** Props
    const {
      index, // permissionData Index
      displayPermission, // permissionData
      checkedPermissionDataList, // viewData
      dataList, // dataList(GrantType)
      isShowOnlyChecked, // check된 항목만 보일지 여부
      isChecked, // defaultCheck 여부
      isDisabled, // disabled 여부
      isDialogShow, // 모달종류에 따른 표시 여부
    } = props;

    if (!isDialogShow) {
      return null;
    }

    // viewData에 등록된 permissionId값만 추출
    const selectPermissionList = checkedPermissionDataList.filter((value: any) => {
      return value.permissionId == displayPermission.permissionId;
    });

    // isShowOnlyChecked 옵션은 권한을 설정한 리스트만 모달에 표시할지 여부
    if (selectPermissionList.length == 0 && isShowOnlyChecked) {
      return null;
    }

    let selectPermission = displayPermission;
    if (selectPermissionList.length > 0) {
      selectPermission = selectPermissionList[0];
    } else {
      const newPermission = {
        displayName: displayPermission.displayName,
        permissionId: displayPermission.permissionId,
        grantTypeList: [],
      };

      viewData.push(newPermission);
      selectPermission = newPermission;
    }

    return (
      <TableRow key={index} sx={{ '& .MuiTableCell-root:first-of-type': { pl: 0 } }}>
        <TableCell
          sx={{
            textAlign: 'center',
            paddingleft: '2rem',
            fontWeight: 600,
            color: (theme) => `${theme.palette.text.primary} !important`,
          }}
        >
          {displayPermission.displayName}
        </TableCell>

        {dataList.map((grantItem: any, index: any) => (
          <TableCell key={index}>
            <FormGrantLabel
              key={index}
              label={grantItem.type}
              value={grantItem.value}
              isChecked={isCheckedGrantType(
                displayPermission.permissionId,
                selectPermission.permissionId,
                selectPermission.grantTypeList,
                grantItem.value,
              )}
              isDisabled={isDisabled}
              displayPermission={selectPermission}
            />
          </TableCell>
        ))}
      </TableRow>
    );
  };

  // 권한에 따른 역할 상세정보 체크박스 활성화 표시
  const isCheckedGrantType = (
    permissionId: number,
    grant_permissionId: number,
    receiveGrantTypeList: { grant_type: string }[],
    grantType: string,
  ) => {
    if (permissionId != grant_permissionId) {
      return false;
    }

    if (!receiveGrantTypeList || receiveGrantTypeList.length == 0) {
      return false;
    }

    const checkedGrantList = receiveGrantTypeList.map(
      (receiveGrantType: { grant_type: string }) => {
        return receiveGrantType.grant_type;
      },
    );

    if (checkedGrantList.indexOf(grantType) > -1) {
      return true;
    }

    return false;
  };

  // 권한 타입 checkBox 처리
  const onCheckedType = (isChecked: boolean, value: string, permission: permissionType) => {
    setErrMessage('');

    permission.dataChange = true;
    setIsDataChange(true);

    const grantTypeList = permission.grantTypeList.map((grantItem: { grant_type: any }) => {
      return grantItem.grant_type;
    });

    const isExistGrant = grantTypeList.indexOf(value) > -1;

    if (isChecked && !isExistGrant) {
      permission.grantTypeList.push({ grant_type: value });
    } else if (!isChecked && isExistGrant) {
      permission.grantTypeList.splice(grantTypeList.indexOf(value), 1);
    }
  };

  // 버튼 열기
  const handleClickOpen = (action: string, roleId: number) => {
    if (action === '수정') {
      getDetailPermission();
      getDetailRole(roleId, '');
      setDialogRoleUpdateOpen(true);
    }
    if (action === '보기') {
      getDetailRole(roleId, '');
      setDialogRoleViewOpen(true);
    }
    if (action === '등록') {
      getDetailPermission();
      setDialogRoleRegisterOpen(true);
    }
    if (action === '사용자보기') {
      getDetailRole(roleId, 'Y');
      setDialogRoleUserViewOpen(true);
    }
  };

  // 버튼 닫기
  const handleClose = () => {
    setDialogRoleViewOpen(false);
    setDialogRoleRegisterOpen(false);
    setDialogRoleUserViewOpen(false);
    setDialogRoleUpdateOpen(false);
    setValue('roleName', '');
    setViewData([]);
    setIsChecked(false);
    setErrMessage('');
    setIsDataChange(false);
  };

  // 권한 (grantType) 체크박스 선택 시 value 지정 및 체크박스, 역할 이름 존재 여부 체크
  const onSubmit = (data: any) => {
    let getRoleName = data.roleName;

    if (getRoleName === '') {
      getRoleName = title;
    }
    const roleData: any = {
      roleName: getRoleName,
      userId: resData.id,
      roleDto: [],
    };

    viewData.forEach((value: any) => {
      const changeGrantTypeList = value.grantTypeList.map((grant: any) => {
        return {
          permissionId: value.permissionId,
          grantType: grant.grant_type,
        };
      });
      roleData.roleDto.push(...changeGrantTypeList);
    });
    if (dialogTitle === '등록' && isDataChange == false) {
      setErrMessage('역할을 한개 이상 체크해주세요.');

      return false;
    } else if (dialogTitle === '수정' && isDataChange == false) {
      setErrMessage('수정된 사항이 없습니다.');

      return false;
    }
    const filterName = cardData.filter((filterData) => {
      return filterData.title == getRoleName && filterData.roleId != roleId;
    });

    if (filterName.length > 0) {
      setErrMessage('이미 등록된 역할이름이 있습니다.');

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
      const res = await Api.get(`${apiConfig.apiEndpoint}/role`);
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
      const res = await Api.get(`${apiConfig.apiEndpoint}/permission`);
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
            grantTypeList: undefined,
            dataChange: false,
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
        const req = await Api.post(`${apiConfig.apiEndpoint}/role`, {
          roleName: roleData.roleName,
          roleDto: roleData.roleDto,
          regBy: roleData.userId,

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
      console.log('roleData', roleData);
      try {
        const req = await Api.patch(`${apiConfig.apiEndpoint}/role/${roleId}`, {
          roleName: roleData.roleName,
          roleDto: roleData.roleDto,
          updateBy: roleData.userId,
        });
        alert('수정이 완료 되었습니다.');
        location.reload();
      } catch (err: any) {
        console.log('err', err);
        alert('수정에 실패 하였습니다.');
      }
    }
  };

  // 역할 삭제 API호출
  // To Do : 추후 권한 처리 적용 후 삭제 권한자만 보일 수 있도록 수정해야함
  const deleteRole = async (roleId: number) => {
    if (confirm('삭제 하시겠습니까?')) {
      try {
        await Api.delete(`${apiConfig.apiEndpoint}/role/${roleId}`);
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
      const res = await Api.get(`${apiConfig.apiEndpoint}/role/${roleId}`, {
        params: { getInfo: getInfo },
      });

      const resultDataList = res.data.map(
        (permission: {
          display_name: string;
          permission_id: number;
          menu_name: string;
          grant_type_list: { grant_type: string }[];
          id: string;
          adminName: string;
        }) => {
          const value = {
            displayName: permission.display_name,
            permissionId: permission.permission_id,
            menuName: permission.menu_name,
            grantTypeList: permission.grant_type_list,
            id: permission.id,
            adminName: permission.adminName,
          };

          return value;
        },
      );

      setViewData(resultDataList);
    } catch (err) {
      if (err) {
        console.log('message:', err);
      }
    }
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

      {/* 사용자 보기 modal */}
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="body"
        onClose={handleClose}
        open={dialogRoleUserViewOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {modalTitle('사용자 보기')}
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell> 번호 </TableCell>
                    <TableCell> 사용자 ID </TableCell>
                    <TableCell> 사용자 이름 </TableCell>
                  </TableRow>
                </TableHead>
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
              </Table>
            </TableContainer>
          </DialogContent>
          {modalButton('confirm')}
        </form>
      </Dialog>

      {/* 역할 보기 modal */}
      <Dialog fullWidth maxWidth="md" scroll="body" onClose={handleClose} open={dialogRoleViewOpen}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {modalTitle('역할 보기')}
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <Box sx={{ my: 4 }}>
              <Typography variant="h6">{title}</Typography>
            </Box>
            <TableContainer>
              <Table size="small">{dialogRoleViewOpen && grantTablebody(viewData, dataList)}</Table>
            </TableContainer>
          </DialogContent>
          {modalButton('confirm')}
        </form>
      </Dialog>

      {/* 역할 등록 modal */}
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="body"
        onClose={handleClose}
        open={dialogRoleRegisterOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {modalTitle('역할 등록')}
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <Box sx={{ my: 4 }}>{grantNameInput('역할 이름', true, Boolean(errors.roleName))}</Box>
            {grantInputTablebody()}
          </DialogContent>
          {modalButton('submit')}
        </form>
      </Dialog>

      {/* 역할 수정 modal */}
      <Dialog
        fullWidth
        maxWidth="md"
        scroll="body"
        onClose={handleClose}
        open={dialogRoleUpdateOpen}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          {modalTitle('역할 수정')}
          <DialogContent sx={{ p: { xs: 6, sm: 12 } }}>
            <Box sx={{ my: 4 }}>{grantNameInput(`${title}`, false, Boolean())}</Box>
            {grantInputTablebody()}
          </DialogContent>
          {modalButton('submit')}
        </form>
      </Dialog>
    </Grid>
  );
};

export default RolesCards;
