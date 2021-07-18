import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import ConfirmDeleteDialog from 'src/components/customDialog';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack
} from '@material-ui/core';
import { displayToast } from 'src/utils/commonService';
import {
  VisibilityTwoTone as ViewIcon,
  EditTwoTone as EditIcon,
  DeleteTwoTone as DeleteIcon,
} from '@material-ui/icons';
import Assessment from 'src/model/assessment';
import { ASSESSMENT_STATUS } from 'src/config';
import { MESSAGES } from 'src/config/message';
import { clearMsg } from 'src/features/assessment/assessmentSlide';

const handleAssessmentStatus = (status: number) => {
  let label: any = '';
  let color: any = '';
  let variant: any = '';
  switch (status) {
    case ASSESSMENT_STATUS.ACTIVE.key:
      label = ASSESSMENT_STATUS.ACTIVE.value;
      color = 'primary';
      variant = 'filled';
      break;
    case ASSESSMENT_STATUS.INACTIVE.key:
      label = ASSESSMENT_STATUS.INACTIVE.value;
      color = 'default';
      variant = 'filled';

      break;
    default:
      label = ASSESSMENT_STATUS.INACTIVE.value;
      color = 'primary';
      variant = 'outlined';

      break;
  }
  return (
    <Chip
      size="small"
      label={label}
      color={color}
      variant={variant}
      //onClick={() => handleButtonChangeStatus(assessment.id, assessment.status)}
    />
  );
};

const AssessmentTable = (dataRef: any) => {
  const dispatch = useDispatch();

  const assessments: Assessment[] = dataRef.assessments;
  const assessmentCount: number = dataRef.assessmentCount;
  const filter: any = dataRef.filter;
  const setFilter: any = dataRef.setFilter;

  const isFetchingDeleteAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingDeleteAssessment
  );
  const fetchDeleteAssessmentMsg = useSelector(
    (state: any) => state.assessmentSlice.fetchDeleteAssessmentMsg
  );

  const [dataFocus, setDataFocus] = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    !isFetchingDeleteAssessment &&
      !!fetchDeleteAssessmentMsg &&
      displayToast(fetchDeleteAssessmentMsg, MESSAGES.DELETE_SUCCESS, null, () =>
        dispatch(clearMsg(`fetchDeleteAssessmentMsg`))
      );
  }, [dispatch, fetchDeleteAssessmentMsg, isFetchingDeleteAssessment]);

  const handleChangePage = (event: any, newPage: number) => {
    setFilter((parentFilter: any) => ({ ...parentFilter, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: any) : any => {
    setFilter((parentFilter: any) => ({ ...parentFilter, pageSize: event.target.value, page: 0 }));
  };

  const handleButtonView = (id: number) => {
    // dispatch(fetchGetProductById({ productId }));
    // setOpenDetailDialog(true);
  };

  const handleButtonEdit = (id: number) => {
    // dispatch(fetchGetProductById({ productId }));
    // setOpenEditDialog(true);
  };

  const handleDeleteAssessment = () => {
    //dispatch(fetchDelete({ id: dataFocus.id, filter }));
    setOpenConfirmDialog(false);
  };

  const handleButtonDelete = (id: number) => {
    setDataFocus({ ...dataFocus, id: id });
    setOpenConfirmDialog(true);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 500 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>STT</TableCell>
                <TableCell>Key tham gia</TableCell>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Số lượng câu hỏi</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="center">Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!assessments &&
                assessments.map((assessment, index) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{index + filter.pageSize * filter.page + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}> {assessment.join_key}</TableCell>
                      <TableCell>
                        <Typography noWrap>{assessment.title}</Typography>
                      </TableCell>
                      <TableCell> {assessment.number_of_question} questions</TableCell>
                      <TableCell> {assessment.time} minus</TableCell>
                      <TableCell>{handleAssessmentStatus(assessment.status)}</TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Tooltip title="view">
                            <IconButton onClick={() => handleButtonView(assessment.id)}>
                              <ViewIcon color="info" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="edit">
                            <IconButton onClick={() => handleButtonEdit(assessment.id)}>
                              <EditIcon color="primary" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="delete">
                            <IconButton onClick={() => handleButtonDelete(assessment.id)}>
                              <DeleteIcon color="error" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={assessmentCount}
          rowsPerPage={filter.pageSize}
          page={filter.page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {openConfirmDialog && (
        <ConfirmDeleteDialog
          needOpen={openConfirmDialog}
          setNeedOpen={setOpenConfirmDialog}
          title={MESSAGES.DELETE_ASSESSMENT}
          button1={{ title: MESSAGES.BTN_CANCEL, action: () => setOpenConfirmDialog(false) }}
          button2={{ title: MESSAGES.BTN_YES, action: handleDeleteAssessment }}
        />
      )}
    </>
  );
};

const useStyles = makeStyles({});

export default AssessmentTable;
