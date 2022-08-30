import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
// import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { makeStyles } from '@material-ui/core/styles';

export const useDataGridStyles = makeStyles((theme: any) => ({
  root: {
    '&.MuiDataGrid-cellContent .MuiDataGrid-footerContainer .MuiTablePagination-root':
      {
        color: theme.palette.text.secondary,
      },
    '&.MuiDataGrid-root .MuiTableCell-body .MuiTableCell-sizeMedium .css-1ex1afd-MuiTableCell-root':
      {
        color: theme.palette.text.secondary,
      },
    '&.MuiDataGrid-root .MuiDataGrid-cell': {
      borderColor: '#333',
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
      {
        outline: 'none',
      },

    '& .currently_playing, .currently_playing.MuiDataGrid-row:hover, .currently_playing.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}20`,
        color: theme.palette.text.primary,
      },
    '& .activated, .activated.MuiDataGrid-row:hover, .activated.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}50`,
        color: theme.palette.text.primary,
      },
    '& .disabled.MuiDataGrid-row': {
      pointerEvents: 'none',
      color: '#666',
    },
    '& .disabled.MuiDataGrid-row .MuiIconButton-root': {
      pointerEvents: 'none',
      color: '#666',
    },
  },
}));

function createData(name: string, countWidgets: number, actions: number) {
  return {
    name,
    countWidgets,
    actions,
    qlcTrigger: [
      {
        qlcid: 34,
        qlctype: 'Slider',
        qlcname: 'Medium colour cycle (138 bpm)',
        qlcvalue: 16,
      },
      {
        qlcid: 12,
        qlctype: 'Button',
        qlcname: 'Sound control Auto',
        qlcvalue: 'Off',
      },
    ],
  };
}

function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = React.useState(true);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.name}
        </TableCell>
        <TableCell align="right">{row.countWidgets}</TableCell>
        <TableCell align="right">{row.actions}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                QLC+ Widget (Do This)
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>QLC+ ID</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell align="right">Name</TableCell>
                    <TableCell align="right">QLC Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.qlcTrigger.map((qlcTriggerRow) => (
                    <TableRow key={qlcTriggerRow.qlcid}>
                      <TableCell component="th" scope="row">
                        {qlcTriggerRow.qlcid}
                      </TableCell>
                      <TableCell>{qlcTriggerRow.qlctype}</TableCell>
                      <TableCell align="right">
                        {qlcTriggerRow.qlcname}
                      </TableCell>
                      <TableCell align="right">
                        {qlcTriggerRow.qlcvalue}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

const rows = [
  createData('scene_activated: blue', 2, 6),
  createData('scene_activated: Red', 237, 9),
];

export default function QLCDropdownTable() {
  const classes = useDataGridStyles();
  return (
    <TableContainer className={classes.root}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Trigger Event Type and Name (If This)</TableCell>
            <TableCell align="right">QLC+ Widget/s (Do This)</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
