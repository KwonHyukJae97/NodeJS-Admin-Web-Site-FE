// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import Magnify from "mdi-material-ui/Magnify";
import {Plus} from "mdi-material-ui";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";

interface TableHeaderProps {
  value: string
  toggle: () => void
  handleFilter: (val: string) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { handleFilter, toggle, value } = props

  return (
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: '32px'}}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width:'80%'}} >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 3, mb: 2, ml: 10, width: '40%'}}
          placeholder='검색어를 입력해주세요.'
          onChange={e => handleFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Magnify fontSize='small' />
              </InputAdornment>
            )
          }}
        />
        <Button sx={{ mb: 2 }} color='secondary' variant='outlined' >
          <Typography variant='subtitle2' style={{ fontWeight: 700 }}>
          검색
          </Typography>
        </Button>
      </Box>

      <Button sx={{ mr: 10, mb: 2, padding: '10px 18px' }} onClick={toggle} variant='contained' startIcon={<Plus />}>
        <Typography variant='body2'style={{ color: "white" , fontWeight: 700}}>
          등록
        </Typography>
      </Button>

    </Box>
  )
}

export default TableHeader
