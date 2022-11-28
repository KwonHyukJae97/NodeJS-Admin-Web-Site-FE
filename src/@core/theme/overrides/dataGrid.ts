// ** MUI Imports
import { Theme } from '@mui/material/styles';

// DataGrid 컴포넌트
const DataGrid = (theme: Theme) => {
  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          width: '92%',
          margin: 'auto',
          border: 0,
          color: theme.palette.text.primary,
          '& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within': {
            outline: 'none',
          },
        },
        toolbarContainer: {
          paddingRight: `${theme.spacing(5)} !important`,
          paddingLeft: `${theme.spacing(3.25)} !important`,
        },
        columnHeaders: {
          maxHeight: '54px !important',
          minHeight: '54px !important',
          lineHeight: '24px !important',
          borderTop: `2px solid ${theme.palette.divider}`,

          // 테이블 헤더 색상
          // backgroundColor: theme.palette.customColors.tableHeaderBg
        },
        columnHeader: {
          height: '54px',
          '&:not(.MuiDataGrid-columnHeaderCheckbox)': {
            // padding: theme.spacing(4)
            paddingRight: theme.spacing(5),
            '&:first-of-type': {
              // paddingLeft: theme.spacing(5)
              paddingRight: theme.spacing(5),
            },
          },
          '&:last-of-type': {
            // paddingRight: theme.spacing(5)
          },
        },
        columnHeaderCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important',
        },
        columnHeaderTitleContainer: {
          padding: 0,
          justifyContent: 'center',
        },
        columnHeaderTitle: {
          fontSize: '0.95rem',
          letterSpacing: '0.17px',
        },
        columnSeparator: {
          color: 'white',
        },
        virtualScroller: {
          marginTop: '54px !important',
        },
        virtualScrollerRenderZone: {
          '& .MuiDataGrid-row': {
            maxHeight: '50px !important',
            minHeight: '50px !important',
          },
        },
        row: {
          '&:last-child': {
            '& .MuiDataGrid-cell': {
              borderBottom: 10,
            },
          },
        },
        cell: {
          maxHeight: '50px !important',
          minHeight: '50px !important',
          lineHeight: '20px !important',
          borderColor: theme.palette.divider,
          '&:not(.MuiDataGrid-cellCheckbox)': {
            // padding: theme.spacing(4),
            '&:first-of-type': {
              // paddingLeft: theme.spacing(5),
              justifyContent: 'center',
            },
          },
          '&:last-of-type': {
            // paddingRight: theme.spacing(5),
          },
          '&:focus, &:focus-within': {
            outline: 'none',
          },

          // '&:'
        },
        cellCheckbox: {
          maxWidth: '58px !important',
          minWidth: '58px !important',
        },
        editInputCell: {
          padding: 0,
          color: theme.palette.text.primary,
          '& .MuiInputBase-input': {
            padding: 0,
          },
        },
        footerContainer: {
          minHeight: '50px !important',
          borderTop: `2px solid ${theme.palette.divider}`,
          padding: '4px 0 24px 0',
          '& .MuiTablePagination-toolbar': {
            minHeight: '50px !important',
          },
          '& .MuiTablePagination-select': {
            color: theme.palette.text.primary,
          },
        },
      },
      defaultProps: {
        rowHeight: 50,
        headerHeight: 54,
      },
    },
  };
};

export default DataGrid;
