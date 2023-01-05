// ** React Imports
import React from 'react';

// ** Next Imports
import Link from 'next/link';

// ** MUI Imports
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Plus } from 'mdi-material-ui';
import Divider from '@mui/material/Divider';
import { FormControl } from '@mui/material';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Magnify from 'mdi-material-ui/Magnify';
import InputLabel from '@mui/material/InputLabel';

// ** Third Party Import
import { auto } from '@popperjs/core';

// props 타입 정의
interface SearchButtonsHeaderProps {
  isWordList?: boolean | null;
  isDuplicationWordList?: boolean | null;
  isRegisterWord?: boolean | null;
}

// 단어 핸들링 버튼 헤더 컴포넌트
const SearchButtonsHeader = ({
  isWordList,
  isDuplicationWordList,
  isRegisterWord,
}: SearchButtonsHeaderProps) => {
  return (
    <>
      <Divider
        sx={{
          borderWidth: 'unset',
          border: '1px solid rgba(76, 78, 100, 0.12)',
          mt: 4,
          mb: 3.5,
          ml: 12,
          mr: 12,
        }}
      />
      <Box sx={{ ml: 16, mr: 15, pb: 1.5 }}>
        {/* 단어 핸들링 버튼 영역 */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, ml: 1 }}>
              총 10,000개
            </Typography>
          </Box>

          {/* 전체 단어 리스트 페이지에서 사용할 경우 */}
          {isWordList ? (
            <>
              <Box
                sx={{
                  width: 840,
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Button variant="contained">비슷하지만 다른말 펼치기/닫기</Button>
                <Button variant="contained">단어 레벨 정보 변경</Button>
                <Link href={'/word/duplication/list'} passHref>
                  <Button variant="contained">중복 단어 보기</Button>
                </Link>
                <Box
                  sx={{
                    width: 250,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant="contained" startIcon={<Plus />}>
                    엑셀 등록
                  </Button>
                  <Button variant="contained" startIcon={<Plus />}>
                    수기 등록
                  </Button>
                </Box>
              </Box>
            </>
          ) : null}

          {/* 중복된 단어 대표 설정 페이지에서 사용할 경우 */}
          {isDuplicationWordList ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Button variant="contained">비슷하지만 다른말 펼치기/닫기</Button>
              </Box>
            </>
          ) : null}

          {/* 전체 단어 수기 등록 페이지에서 사용할 경우 */}
          {isRegisterWord ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    width: 250,
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button variant="contained" startIcon={<Plus />}>
                    엑셀 업로드
                  </Button>
                  <Button variant="contained" startIcon={<Plus />}>
                    단어 추가
                  </Button>
                </Box>
              </Box>
            </>
          ) : null}
        </Box>
      </Box>

      <Divider
        sx={{
          borderWidth: 'unset',
          border: '0.75px solid rgba(76, 78, 100, 0.12)',
          ml: 12,
          mr: 12,
        }}
      />

      <Box sx={{ ml: 16, mr: 15, pb: 4 }}>
        {/* 단어 추가 검색 영역 */}
        <Box
          sx={{
            mt: 4,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box>
            <FormControl size="small">
              <InputLabel id="plan-select">데이터 수</InputLabel>
              <Select
                size="small"
                // value={plan}
                id="select-plan"
                label="Select Plan"
                labelId="plan-select"
                // onChange={handlePlanChange}
              >
                <MenuItem value="10">10개</MenuItem>
                <MenuItem value="30">30개</MenuItem>
                <MenuItem value="50">50개</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}
          >
            {/* 전체 단어 리스트 페이지일 경우에만 사용 */}
            {isWordList ? (
              <>
                <FormControl>
                  <Select
                    label=""
                    id="searchKey"
                    // value={searchKey}
                    size="small"
                    inputProps={{ 'aria-label': 'Without label' }}
                    displayEmpty
                    defaultValue=""
                    required={true}
                    // error={searchKeyError}
                    // onChange={(e) => handleChangeKey(e)}

                    // labelId="validation-basic-select"
                    // aria-describedby="validation-basic-select"
                  >
                    <MenuItem disabled value="">
                      검색 타입
                    </MenuItem>
                    <MenuItem value={'isComment'}>본단어</MenuItem>
                    <MenuItem value={'writer'}>비슷하지만 다른말</MenuItem>
                  </Select>
                  {/*{searchKeyError && (*/}
                  {/*  <FormHelperText sx={{ color: 'error.main' }} id="validation-basic-select">*/}
                  {/*    This field is required*/}
                  {/*  </FormHelperText>*/}
                  {/*)}*/}
                </FormControl>
              </>
            ) : null}

            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField
                size="small"
                // value={searchWord}
                sx={{
                  ml: 4,
                  width: 240,
                  '& .MuiInputBase-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 },
                }}
                placeholder="검색어를 입력해주세요."
                // onChange={(e) => handleChangeKeyword(e)}
              />
              <Button
                sx={{
                  padding: '0.55rem 0.2rem 0.55rem 0.8rem',
                  border: '1px solid lightGrey',
                  borderRadius: 1,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  backgroundColor: 'white',
                  minWidth: auto,
                }}
                type="submit"
                startIcon={<Magnify color="primary" fontSize="large" />}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SearchButtonsHeader;
