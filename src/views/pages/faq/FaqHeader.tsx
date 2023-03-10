// ** React Imports
import { ChangeEvent } from 'react'

// ** MUI Imports
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import MuiCard, { CardProps } from '@mui/material/Card'
import InputAdornment from '@mui/material/InputAdornment'
import MuiTextField, { TextFieldProps } from '@mui/material/TextField'

// ** Icons Imports
import Magnify from 'mdi-material-ui/Magnify'

interface Props {
  searchTerm: string
  setSearchTerm: (value: string) => void
}

// Styled Card component
const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  border: 0,
  boxShadow: 'none',
  backgroundSize: 'cover',
  backgroundImage:
    theme.palette.mode === 'light'
      ? 'url(/images/pages/pages-header-bg-light.png)'
      : 'url(/images/pages/pages-header-bg-dark.png)'
}))

// Styled TextField component
const TextField = styled(MuiTextField)<TextFieldProps>(({ theme }) => ({
  width: '100%',
  '& .MuiOutlinedInput-root': {
    backgroundColor: theme.palette.background.paper
  },
  [theme.breakpoints.up('sm')]: {
    width: 450
  }
}))

// FAQ 헤더(검색창) 컴포넌트
const FaqHeader = (props: Props) => {
  // ** Props
  const { searchTerm, setSearchTerm } = props

  const handleFaqFilter = (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <Card>
      <CardContent sx={{ pt: 20, textAlign: 'center', pb: theme => `${theme.spacing(25)} !important` }}>
        <Typography
          variant='h5'
          sx={{ mb: 2.5, color: 'primary.main', fontWeight: 600, fontSize: '1.5rem !important' }}
        >
          Hello, how can we help?
        </Typography>
        <Typography variant='body2' sx={{ mb: 6.5 }}>
          or choose a category to quickly find the help you need
        </Typography>
        <TextField
          value={searchTerm}
          placeholder='궁금한 키워드를 입력해보세요.'
          onChange={e => handleFaqFilter(e)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify />
              </InputAdornment>
            )
          }}
        />
      </CardContent>
    </Card>
  )
}

export default FaqHeader
