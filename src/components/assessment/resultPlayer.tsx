import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Slide,
  InputAdornment,
  Backdrop,
  FormControlLabel,
  CircularProgress
} from '@material-ui/core';
import { StopRounded as SquareIcon, Close as CloseIcon } from '@material-ui/icons';
import moment from 'moment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

const ResultPlayer = ({ needOpen, handleClose, assessment }: any) => {
  const showResult = (data: string) => {
    const result = JSON.parse(data);
    let show = '';
    result.map((res: any, index: number) => {
      show += `Question ${index + 1} : ${RESULT_QUESTION[res]} \n`;
    });
    return show;
  };
  
  return (
    <>
      <Dialog open={needOpen} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} sx={{ mr: 3 }}>
              <CloseIcon />
            </IconButton>
            <Typography>Results Player</Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Container>
            <TableContainer sx={{ maxHeight: 800 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Player Name</TableCell>
                    <TableCell>Point</TableCell>
                    <TableCell>Result</TableCell>
                    <TableCell>End Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!!assessment &&
                    assessment.listResults.length > 0 &&
                    assessment.listResults.map((result: any, index: number) => {
                      return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell> {result.name_player}</TableCell>
                          <TableCell> {result.point}</TableCell>
                          <TableCell> {showResult(result.results)}</TableCell>
                          <TableCell> {moment(result.created_at).format('LLLL')}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultPlayer;
