// ** MUI Imports
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select, {SelectChangeEvent} from '@mui/material/Select'

// ** Icons Imports
import ExportVariant from 'mdi-material-ui/ExportVariant'
import InputAdornment from "@mui/material/InputAdornment";
import Magnify from "mdi-material-ui/Magnify";
import Typography from "@mui/material/Typography";
import {Plus} from "mdi-material-ui";
import CardHeader from "@mui/material/CardHeader";

interface TableHeaderProps {
  plan: string
  value: string
  handleFilter: (val: string) => void
  handlePlanChange: (e: SelectChangeEvent) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const {plan, handlePlanChange, handleFilter, value} = props

  return (

    <Box>
      <Box sx={{
        p: 5,
        pb: 1,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '18px'
      }}>

        <Box sx={{mr: 3, mb: 2, ml: 6}}>
          <Typography variant='subtitle1'>총 2,322개</Typography>
        </Box>

        <Button sx={{mr: 5, mb: 2, padding: '10px 18px'}} variant='contained' startIcon={<Plus/>}>
          <Typography variant='body2' style={{color: "white", fontWeight: 700}}>
            등록
          </Typography>
        </Button>
      </Box>

      <div style={{ borderBottom: '1px solid lightGrey'}}></div>

      <Box sx={{display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between'}}>
        <Box sx={{p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
          {/*<Box sx={{mr: 3, mb: 2, ml: 5}} style={{backgroundColor: 'red', fontWeight: 700}}>*/}
          {/*  <Typography variant='subtitle2'>데이터 수</Typography>*/}
          {/*</Box>*/}

          <FormControl size='small' sx={{mb: 2, ml: 5}}>
            <InputLabel id='plan-select'>데이터 수</InputLabel>
            <Select
              size='small'
              value={plan}
              id='select-plan'
              label='Select Plan'
              labelId='plan-select'
              onChange={handlePlanChange}
              inputProps={{placeholder: 'Select Plan'}}
            >
              <MenuItem value=''>10개</MenuItem>
              <MenuItem value='basic'>25개</MenuItem>
              <MenuItem value='company'>50개</MenuItem>
              {/*<MenuItem value='enterprise'>Enterprise</MenuItem>*/}
              {/*<MenuItem value='team'>Team</MenuItem>*/}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ mr: 10, display: 'flex', flexWrap: 'wrap'}}>
          <TextField
            size='small'
            value={value}
            sx={{ mb: 2, width: '450px'}}
            placeholder='검색어를 입력해주세요.'
            onChange={e => handleFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>
                  <Magnify fontSize='small'/>
                </InputAdornment>
              )
            }}
          />
          {/*<Button sx={{mb: 2}} color='secondary' variant='outlined'>*/}
          {/*  <Typography variant='subtitle2' style={{fontWeight: 700}}>*/}
          {/*    검색*/}
          {/*  </Typography>*/}
          {/*</Button>*/}
        </Box>
      </Box>

    </Box>

    // <Box sx={{ p: 5, pb: 3, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
    //   <Button sx={{ mr: 4, mb: 2 }} color='secondary' variant='outlined' startIcon={<ExportVariant />}>
    //     Export
    //   </Button>
    //   <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
    //     <TextField
    //       size='small'
    //       value={value}
    //       placeholder='Search User'
    //       sx={{ mr: 6, mb: 2 }}
    //       onChange={e => handleFilter(e.target.value)}
    //     />
    //     <FormControl size='small' sx={{ mb: 2 }}>
    //       <InputLabel id='plan-select'>Select Plan</InputLabel>
    //       <Select
    //         size='small'
    //         value={plan}
    //         id='select-plan'
    //         label='Select Plan'
    //         labelId='plan-select'
    //         onChange={handlePlanChange}
    //         inputProps={{ placeholder: 'Select Plan' }}
    //       >
    //         <MenuItem value=''>Select Plan</MenuItem>
    //         <MenuItem value='basic'>Basic</MenuItem>
    //         <MenuItem value='company'>Company</MenuItem>
    //         <MenuItem value='enterprise'>Enterprise</MenuItem>
    //         <MenuItem value='team'>Team</MenuItem>
    //       </Select>
    //     </FormControl>
    //   </Box>
    // </Box>
  )
}

export default TableHeader
