// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

// ** Icons Imports
import ExportVariant from 'mdi-material-ui/ExportVariant'
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
    <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginTop: '24px', backgroundColor: 'green'}}>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', width:'80%', backgroundColor: 'orange'}} >
        <TextField
          size='small'
          value={value}
          sx={{ mr: 3, mb: 2, ml: 4, width: '40%'}}
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
          <Typography variant='subtitle2'>
          검색
          </Typography>
        </Button>
      </Box>

      <Button sx={{ mr: 4, mb: 2, backgroundColor: 'orange', paddingRight: '16px', paddingLeft: '16px' }} onClick={toggle} variant='contained' startIcon={<Plus />}>
        <Typography variant='body2'style={{ color: "white" }}>
          등록
        </Typography>
      </Button>

    </Box>
  )

  // return (
  //   <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
  //     <Button sx={{ mr: 4, mb: 2 }} color='secondary' variant='outlined' startIcon={<ExportVariant fontSize='small' />}>
  //       Export
  //     </Button>
  //     <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
  //       <TextField
  //         size='small'
  //         value={value}
  //         sx={{ mr: 6, mb: 2 }}
  //         placeholder='Search User'
  //         onChange={e => handleFilter(e.target.value)}
  //       />
  //
  //       <Button sx={{ mb: 2 }} onClick={toggle} variant='contained'>
  //         Add User
  //       </Button>
  //     </Box>
  //   </Box>
  // )
}

export default TableHeader
