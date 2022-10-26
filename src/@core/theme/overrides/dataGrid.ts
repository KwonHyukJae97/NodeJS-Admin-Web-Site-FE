// ** MUI Imports
import { Theme } from '@mui/material/styles'

const DataGrid = (theme: Theme) => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          width: '92%',
          margin: 'auto',
          border: 0,
          // color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none'
          }
        },
        toolbarContainer: {
          paddingRight: `${theme.spacing(5)} !important`,
          paddingLeft: `${theme.spacing(3.25)} !important`
        },
        columnHeaders: {
          maxHeight: '54px !important',
          minHeight: '54px !important',
          lineHeight: '24px !important',
          borderTop: `2px solid ${theme.palette.divider}`,
          // backgroundColor: theme.palette.customColors.tableHeaderBg
        },
        columnHeader: {
          // backgroundColor: 'orange',
          height: '54px',
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            // padding: theme.spacing(4)
            padding: theme.spacing(3),
            '&:first-of-type': {
              // paddingLeft: theme.spacing(5)
              paddingLeft: theme.spacing(2),
            }
          },
          '&:last-of-type': {
            // paddingRight: theme.spacing(5)
            paddingRight: theme.spacing(8)
          }
        },
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        columnHeaderTitleContainer: {
          padding: 0,
          justifyContent: 'center',
          // backgroundColor: 'yellow'

        },
        columnHeaderTitle: {
          fontSize: '0.95rem',
          letterSpacing: '0.17px',
          textTransform: 'uppercase'
        },
        columnSeparator: {
          // color: theme.palette.divider
          color: 'white'
        },
        virtualScroller: {
          marginTop: '54px !important'
        },
        virtualScrollerRenderZone: {
          '& .MuiDataGrid-row': {
            maxHeight: '50px !important',
            minHeight: '50px !important'
          }
        },
        row: {
          // backgroundColor: 'red',
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 0
            }
          }
        },
        cell: {
          // backgroundColor: 'red',
          maxHeight: '50px !important',
          minHeight: '50px !important',
          lineHeight: '20px !important',
          borderColor: theme.palette.divider,
          '&:not(.MuiDataGrid-cellCheckbox)': {
            padding: theme.spacing(4),
            // backgroundColor: 'blue',
            '&:first-of-type': {
              paddingLeft: theme.spacing(5),
              justifyContent: 'center',
              // backgroundColor: 'red'
            }
          },
          '&:last-of-type': {
            paddingRight: theme.spacing(5),
            // backgroundColor: 'red'
          },
          '&:focus, &:focus-within': {
            outline: 'none'
          }
        },
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important'
        },
        editInputCell: {
          padding: 0,
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: 0
          }
        },
        footerContainer: {
          minHeight: '50px !important',
          // backgroundColor: 'yellow',
          borderTop: `2px solid ${theme.palette.divider}`,
          padding: '4px 0 24px 0',
          '& .MuiTablePagination-toolbar': {
            // minHeight: '50px !important'
          },
          '& .MuiTablePagination-select': {
            // color: theme.palette.text.primary
          }
        }
      },
      defaultProps: {
        rowHeight: 50,
        headerHeight: 54
      }
    }
  }
}

export default DataGrid
