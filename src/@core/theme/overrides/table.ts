// ** MUI Imports
import { Theme } from '@mui/material/styles'

const Table = (theme: Theme) => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          boxShadow: theme.shadows[0],
          borderTopColor: theme.palette.divider,
          borderTop: `1.5px solid ${theme.palette.divider}`,
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          textTransform: 'uppercase',
          '& .MuiTableCell-head': {
            paddingLeft: '0px',
            fontWeight: 500,
            fontSize: '1rem',
            lineHeight: '1.35rem',
            letterSpacing: '0.17px',

            // backgroundColor: 'red',
            textAlign: 'center'
          }
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-body': {
            // backgroundColor: 'orange',
            paddingLeft: '0px',
            fontWeight: 400,
            fontSize: '1rem',
            lineHeight: '1.358rem',
            letterSpacing: '0.15px',
            '&:not(.MuiTableCell-sizeSmall):not(.MuiTableCell-paddingCheckbox):not(.MuiTableCell-paddingNone)': {
              paddingTop: theme.spacing(4),
              paddingBottom: theme.spacing(4)
            }
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head:first-child, & .MuiTableCell-root:first-child ': {
            paddingLeft: theme.spacing(10),

            // paddingRight: theme.spacing(15)
          },
          '& .MuiTableCell-head:last-child, & .MuiTableCell-root:last-child': {
            paddingRight: theme.spacing(15)
          }
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          // padding: '16px 16px 0 16px',
          borderBottom: `1.5px solid ${theme.palette.divider}`,
          '& .MuiButton-root': {
            textTransform: 'uppercase',
            color: theme.palette.text.secondary
          }
        },
        stickyHeader: {
          backgroundColor: theme.palette.customColors.tableHeaderBg,
        }
      }
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          '& .MuiIconButton-root.Mui-disabled': {
            color: theme.palette.action.active
          }
        },
        displayedRows: {
          color: theme.palette.text.primary
        }
      }
    }
  }
}

export default Table
