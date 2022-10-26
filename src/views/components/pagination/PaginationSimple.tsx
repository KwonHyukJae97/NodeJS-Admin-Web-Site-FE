// ** MUI Imports
import Pagination from '@mui/material/Pagination'

const PaginationSimple = () => {
  return (
    <div className='demo-space-y' style={{ backgroundColor: 'cornflowerblue', padding: '14px 50px 34px 50px', display: 'flex', justifyContent: 'flex-end'}}>
      {/*<div>*/}
        <Pagination count={10} />
      {/*</div>*/}
      {/*<Pagination count={10} color='primary' />*/}
      {/*<Pagination count={10} color='secondary' />*/}
    </div>
  )
}

export default PaginationSimple
