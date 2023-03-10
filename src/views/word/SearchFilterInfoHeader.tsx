// ** React Imports
import React, { useCallback, useState } from 'react';

// ** MUI Imports
import Box from '@mui/material/Box';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';

// props 타입 정의
interface SearchFilterHeaderProps {
  useType: string;
}

// 전체 단어에 대한 검색 및 정보 관련 헤더 컴포넌트
const SearchFilterInfoHeader = ({ useType }: SearchFilterHeaderProps) => {
  // ** State
  const [wordLevel, setWordLevel] = useState<string>('');
  const [project, setProject] = useState<string>('');
  const [sound, setSound] = useState<string>('');
  const [example, setExample] = useState<string>('');
  const [descImage, setDescImage] = useState<string>('');
  const [pictureImage, setPictureImage] = useState<string>('');
  const [similarWord, setSimialrWord] = useState<string>('');
  const [mainWord, setMainWord] = useState<string>('');

  const handleWordLevelChange = useCallback((e: SelectChangeEvent) => {
    setWordLevel(e.target.value);
  }, []);

  const handleProjectChange = useCallback((e: SelectChangeEvent) => {
    setProject(e.target.value);
  }, []);

  const handleSoundChange = useCallback((e: SelectChangeEvent) => {
    setSound(e.target.value);
  }, []);

  const handleExampleChange = useCallback((e: SelectChangeEvent) => {
    setExample(e.target.value);
  }, []);

  const handleDescImageChange = useCallback((e: SelectChangeEvent) => {
    setDescImage(e.target.value);
  }, []);

  const handlePictureImageChange = useCallback((e: SelectChangeEvent) => {
    setPictureImage(e.target.value);
  }, []);

  const handleSimilarWordChange = useCallback((e: SelectChangeEvent) => {
    setSimialrWord(e.target.value);
  }, []);

  const handleMainWordChange = useCallback((e: SelectChangeEvent) => {
    setMainWord(e.target.value);
  }, []);

  return (
    <Box
      sx={{
        p: 5,
        pb: 0,
        mt: 2,
      }}
    >
      {/* 다중 검색 필터를 사용할 경우(전체 단어 정보 페이지) */}
      {useType === 'searchMultiple' ? (
        <>
          <Box
            sx={{
              mb: 3,
              ml: 10,
              mr: 10,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                단어 레벨
              </Typography>
              <Select
                label=""
                id="wordLevel"
                value={wordLevel}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleWordLevelChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>답변상태</MenuItem>
                <MenuItem value={'writer'}>작성자</MenuItem>
                <MenuItem value={'commenter'}>답변자</MenuItem>
                <MenuItem value={'regDate'}>등록일</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                프로젝트
              </Typography>
              <Select
                label=""
                id="project"
                value={project}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleProjectChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>답변상태</MenuItem>
                <MenuItem value={'writer'}>작성자</MenuItem>
                <MenuItem value={'commenter'}>답변자</MenuItem>
                <MenuItem value={'regDate'}>등록일</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                음원
              </Typography>
              <Select
                label=""
                id="sound"
                value={sound}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleSoundChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>등록</MenuItem>
                <MenuItem value={'writer'}>미등록</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                예문
              </Typography>
              <Select
                label=""
                id="example"
                value={example}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleExampleChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>등록</MenuItem>
                <MenuItem value={'writer'}>미등록</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              mb: 5,
              ml: 10,
              mr: 10,
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                설명 이미지
              </Typography>
              <Select
                label=""
                id="descImage"
                value={descImage}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleDescImageChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>등록</MenuItem>
                <MenuItem value={'writer'}>미등록</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                그림 이미지
              </Typography>
              <Select
                label=""
                id="pictureImage"
                value={pictureImage}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handlePictureImageChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>등록</MenuItem>
                <MenuItem value={'writer'}>미등록</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                비슷하지만 다른말
              </Typography>
              <Select
                label=""
                id="similarWord"
                value={similarWord}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleSimilarWordChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>등록</MenuItem>
                <MenuItem value={'writer'}>미등록</MenuItem>
              </Select>
            </FormControl>

            <FormControl>
              <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                대표단어
              </Typography>
              <Select
                label=""
                id="mainWord"
                value={mainWord}
                size="small"
                inputProps={{ 'aria-label': 'Without label' }}
                displayEmpty
                defaultValue=""
                onChange={handleMainWordChange}
                sx={{ width: 240 }}
              >
                <MenuItem value="">전체</MenuItem>
                <MenuItem value={'isComment'}>대표단어</MenuItem>
                <MenuItem value={'writer'}>일반단어</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </>
      ) : (
        <>
          {/* 단일 검색 필터를 사용할 경우(중복된 단어 대표설정 페이지) */}
          {useType === 'searchOne' ? (
            <Box
              sx={{
                mb: 5,
                ml: 10,
                mr: 10,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <FormControl>
                <Typography variant="body2" sx={{ mb: 1, ml: 2 }}>
                  검색 타입
                </Typography>
                <Select
                  label=""
                  id="wordLevel"
                  // value={wordLevel}
                  size="small"
                  inputProps={{ 'aria-label': 'Without label' }}
                  displayEmpty
                  defaultValue=""
                  // onChange={handleWordLevelChange}
                  sx={{ width: 180 }}
                >
                  <MenuItem value="">전체</MenuItem>
                  <MenuItem value={'isComment'}>자동으로 대표 설정</MenuItem>
                  <MenuItem value={'writer'}>수동으로 대표 설정</MenuItem>
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Box
              sx={{
                mb: 3,
                ml: 10,
                mr: 10,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}
            >
              {/* 정보만 사용할 경우(전체 단어 등록 페이지) */}
              <Box sx={{ ml: 2 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  단어 레벨
                </Typography>
                <Typography variant="h6">초등기초</Typography>
              </Box>

              <Box sx={{ ml: 10 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  교재명
                </Typography>
                <Typography variant="h6">파닉스 2022 2학기</Typography>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default SearchFilterInfoHeader;
