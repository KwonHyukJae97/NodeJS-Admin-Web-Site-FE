// ** React Imports
import React from 'react';

// ** Next Import
import Link from 'next/link';

// ** MUI Imports
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Plus } from 'mdi-material-ui';

// props 타입 정의
interface TotalDataButtonSectionProps {
  totalData: number;
  useType?: string | null;
  onClickEvent?: React.MouseEventHandler<HTMLButtonElement> | null;
}

// 총 데이터 수 및 부가 버튼 영역 관련 컴포넌트
const TotalDataButtonSection = ({
  totalData,
  useType,
  onClickEvent,
}: TotalDataButtonSectionProps) => {
  return (
    <>
      <Divider
        sx={{
          borderWidth: 'unset',
          border: '1px solid rgba(76, 78, 100, 0.12)',
          mt: 4,
          mb: 3,
          ml: 12,
          mr: 12,
        }}
      />

      <Box sx={{ ml: 16, mr: 15 }}>
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
              총 {totalData}개
            </Typography>
          </Box>

          {/* 전체 단어 리스트 페이지에서 사용할 경우 */}
          {useType === 'totalWord' ? (
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
                <Link href={'/word/add'} passHref>
                  <Button variant="contained" startIcon={<Plus />}>
                    수기 등록
                  </Button>
                </Link>
              </Box>
            </Box>
          ) : (
            <>
              {/* 중복된 단어 대표 설정 페이지에서 사용할 경우 */}
              {useType === 'duplicateWord' && onClickEvent ? (
                <Button variant="contained" onClick={onClickEvent}>
                  비슷하지만 다른말 펼치기/닫기
                </Button>
              ) : (
                <>
                  {/* 전체 단어 수기 등록 페이지에서 사용할 경우 */}
                  {useType === 'addWord' ? (
                    <Box
                      sx={{
                        width: 250,
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Button variant="contained">엑셀 업로드</Button>
                      <Button variant="contained" startIcon={<Plus />}>
                        단어 추가
                      </Button>
                    </Box>
                  ) : (
                    <>
                      {/* 그외 등록 페이지에서 사용할 경우 */}
                      {useType === 'addContent' && onClickEvent ? (
                        <Button variant="contained" onClick={onClickEvent} startIcon={<Plus />}>
                          등록
                        </Button>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      <Divider
        sx={{
          borderWidth: 'unset',
          border: '1px solid rgba(76, 78, 100, 0.12)',
          ml: 12,
          mr: 12,
          mt: 3,
          mb: 4,
        }}
      />
    </>
  );
};

export default TotalDataButtonSection;
