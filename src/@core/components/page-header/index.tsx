// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Types
import { PageHeaderProps } from './types'

const PageHeader = (props: PageHeaderProps) => {
  // ** Props
  const { title, subtitle } = props

  return (
    <Grid item xs={12} style={{ marginTop: '36px', display: 'flex', alignItems: 'center', width: '100%', paddingLeft: '32px'}}>
      <div style={{flex: 1}}>
        {title}
      </div>
      <div style={{ borderRight: '2px solid lightGrey', height: '28px'}}></div>
      <div style={{flex: 5, paddingLeft: '22px'}}>
        {subtitle || null}
      </div>
    </Grid>
  )
}

export default PageHeader
