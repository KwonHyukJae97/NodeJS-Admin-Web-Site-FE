// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** Next Imports
import { GetStaticProps, InferGetStaticPropsType } from 'next/types'

// ** Config
import boardConfig from 'src/configs/board'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icons Imports
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'

// ** Third Party Imports
import axios from 'axios'

// ** Types
import {Faq, FaqCategory, FaqType} from 'src/@fake-db/types'

// ** Demo Imports
import FaqHeader from 'src/views/pages/faq/FaqHeader'
import FaqFooter from 'src/views/pages/faq/FaqFooter'
import FaqAccordions from 'src/views/pages/faq/FaqAccordions'

// Styled Box component
const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(6, 35, 0, 35),
  [theme.breakpoints.down('md')]: {
    padding: theme.spacing(6, 25, 0, 25)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(14.25, 0, 0)
  },
  '& > :not(:first-of-type)': {
    marginTop: theme.spacing(6)
  }
}))

// FAQ 화면 실행
// const FAQ = () => {
//   // ** States
//   const [data, setData] = useState<Faq[] | null>(null)
//   const [searchTerm, setSearchTerm] = useState<string>('')
//
//   useEffect(async () => {
//     // 카테고리 목록 조회
//     const categoryList: any = await axios.get(boardConfig.faqCategoryListEndpoint, {params: {role: '본사 관리자'}})
//       .then(response => {
//         console.log('카테고리 리스트', response.data)
//         return response.data
//       })
//
//     const faqList: any = await axios.get(boardConfig.faqListEndpoint, {params: {role: '본사 관리자'}})
//       .then(response => {
//         console.log('faq 리스트', response.data)
//         return response.data
//       })
//
//     // 최종 데이터 리스트
//
//     // faq 리스트
//
//     // const plz = () => {
//     //   for(const category of categoryList) {
//     //     faq.push(category)
//     //     faqList.map((data:any) => {
//     //       if (category.categoryId === data.categoryId.categoryId) {
//     //
//     //       }
//     //     })
//     //     console.log(faq)
//     //   }
//     // }
//     // plz()
//
//     setData(null)
//   },[])

  // useEffect(() => {
  //   // 카테고리 정보 조회
  //   axios.get(boardConfig.faqCategoryListEndpoint, { params: { role: '본사 관리자' } })
  //     .then(response => {
  //       console.log('categoryList', response)
  //     })
  //
  //   axios.get(boardConfig.faqListEndpoint, { params: { role: '본사 관리자' } })
  //     .then(response => {
  //     console.log('faqList',response.data);
  //
  //     const resData = response.data
  //
  //     // 응답 데이터에서 카테고리정보만 선별
  //     // 카테고리에 정보와 응답데이터의 카테고리와 같은 애들끼리 묶어주기
  //     const category = resData.map((data:any) => {
  //       return { categoryId: data.categoryId.categoryId, categoryName: data.categoryId.categoryName }
  //     })
  //     console.log(category);
  //
  //     // 게시글 리스트
  //     const faq:any = [];
  //
  //     // 카테고리별 게시글 리스트의 전체 리스트
  //     const faqList:FaqCategory = [];
  //
  //     // 카테고리별 해당하는 게시글 선별
  //     resData.map((data:any) => {
  //       if (data.categoryId.categoryId === 3) {
  //         faq.push(data)
  //       }
  //       console.log(faq)
  //     })
  //     setData(null)
  //   })
  // }, [])

const FAQ = ({ apiData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  // ** States
  const [data, setData] = useState<FaqType[] | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>('')

  useEffect(() => {
    // 게시글 검색할 경우
    if (searchTerm !== '') {
      axios.get('/pages/faqs', { params: { q: searchTerm } }).then(response => {
        if (response.data && response.data.length) {
          setData(response.data)
        } else {
          setData(null)
        }
      })
    } else {
      // 게시글 검색 없을 시, 모든 데이터 뿌려주기
      setData(apiData)
    }
  }, [apiData, searchTerm])

  // 게시글이 없을 경우 처리하는 컴포넌트
  const renderNoResult = (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <AlertCircleOutline sx={{ mr: 2 }} />
      <Typography variant='h6'>No Results Found!!</Typography>
    </Box>
  )

  return (
    <Fragment>
      <FaqHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <StyledBox>
        {data !== null ? <FaqAccordions data={data} /> : renderNoResult}
        {/*<FaqFooter />*/}
      </StyledBox>
    </Fragment>
  )
}

// Faq 조회 API 요청
export const getStaticProps: GetStaticProps = async () => {
  const res = await axios.get('/pages/faqs')
  const apiData: FaqType = res.data

  return {
    props: {
      apiData
    }
  }
}

export default FAQ
