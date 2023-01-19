// ** React Imports
import React from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { FormControl } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Magnify from 'mdi-material-ui/Magnify';

// ** Third Party Import
import { auto } from '@popperjs/core';

// props 타입 정의
interface DataCountSearchSectionProps {
  searchCategory?: any | null;
}

// 데이터 수 선택옵션 및 추가 검색 영역 관련 컴포넌트
const DataCountSearchSection = ({ searchCategory }: DataCountSearchSectionProps) => {
  return (
    <>
      <Box sx={{ ml: 16, mr: 15, pb: 4 }}>
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
            {/* 검색 카테고리가 있을 경우에만 사용 */}
            {searchCategory ? (
              <>
                <FormControl>
                  <Select
                    label=""
                    id="searchKey"
                    // value={subSearchKey}
                    size="small"
                    inputProps={{ 'aria-label': 'Without label' }}
                    displayEmpty
                    defaultValue=""
                    required={true}
                    // error={subSearchKeyError}
                    // onChange={(e) => handleChangeKey(e)}

                    // labelId="validation-basic-select"
                    // aria-describedby="validation-basic-select"
                  >
                    <MenuItem disabled value="">
                      검색 타입
                    </MenuItem>
                    {searchCategory.map((category: any) => (
                      <MenuItem key={category.value} value={category.value}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                  {/*{subSearchKeyError && (*/}
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
                // value={subSearchWord}
                sx={{
                  ml: 4,
                  width: 240,
                  '& .MuiInputBase-root': {
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                  },
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

export default DataCountSearchSection;
