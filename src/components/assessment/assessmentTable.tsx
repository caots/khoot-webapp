import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/styles';
import DialogSelect from './dialogSelect';
import AssessmentEditDialog from './assessmentEditDialog';
import ResultPlayer from './resultPlayer';
import ConfirmDeleteDialog from 'src/components/customDialog';
import ContentCopyIcon from '@material-ui/icons/ContentCopy';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
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
  DeleteTwoTone as DeleteIcon
} from '@material-ui/icons';
import Assessment, { Question } from 'src/model/assessment';
import { ASSESSMENT_STATUS, CRUD_ACTIONS } from 'src/config';
import { MESSAGES } from 'src/config/message';
import {
  clearMsg,
  fetchDeleteAssessment,
  fetchUpdateStatusAssessment,
  fetchGetAssessmentById,
  fetchCreateAssessment
} from 'src/features/assessment/assessmentSlice';

const handleAssessmentStatus = (assessment: Assessment) => {
  let label: any = '';
  let color: any = '';
  let variant: any = '';
  switch (assessment.status) {
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
  return { label, color, variant };
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
  const isFetchingUpdateStatusAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingUpdateStatusAssessment
  );
  const fetchUpdateStatusAssessmentMsg = useSelector(
    (state: any) => state.assessmentSlice.fetchUpdateStatusAssessmentMsg
  );
  const isFetchingCreateAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingCreateAssessment
  );
  const fetchCreateAssessmentMsg = useSelector(
    (state: any) => state.assessmentSlice.fetchCreateAssessmentMsg
  );

  const currentAssessment = useSelector((state: any) => state.assessmentSlice.currentAssessment);
  const isFetchingGetAssessmentById = useSelector(
    (state: any) => state.assessmentSlice.isFetchingGetAssessmentById
  );

  const [dataFocus, setDataFocus]: any = useState({});
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openChangeStatusDialog, setOpenChangeStatusDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openEditDialogResultPlayer, setOpenEditDialogResultPlayer] = useState(false);

  useEffect(() => {
    !isFetchingDeleteAssessment &&
      !!isFetchingCreateAssessment &&
      displayToast(fetchCreateAssessmentMsg, MESSAGES.ADD_SUCCESS, null, () =>
        dispatch(clearMsg(`fetchCreateAssessmentMsg`))
      );
  }, [dispatch, fetchCreateAssessmentMsg, isFetchingCreateAssessment]);

  useEffect(() => {
    !isFetchingDeleteAssessment &&
      !!fetchDeleteAssessmentMsg &&
      displayToast(fetchDeleteAssessmentMsg, MESSAGES.DELETE_SUCCESS, null, () =>
        dispatch(clearMsg(`fetchDeleteAssessmentMsg`))
      );
  }, [dispatch, fetchDeleteAssessmentMsg, isFetchingDeleteAssessment]);

  useEffect(() => {
    !isFetchingUpdateStatusAssessment &&
      !!fetchUpdateStatusAssessmentMsg &&
      displayToast(fetchUpdateStatusAssessmentMsg, MESSAGES.UPDATE_SUCCESS, null, () =>
        dispatch(clearMsg(`fetchUpdateStatusAssessmentMsg`))
      );
  }, [dispatch, fetchUpdateStatusAssessmentMsg, isFetchingUpdateStatusAssessment]);

  const handleChangePage = (event: any, newPage: number) => {
    setFilter((parentFilter: any) => ({ ...parentFilter, page: newPage }));
  };

  const handleChangeRowsPerPage = (event: any): any => {
    setFilter((parentFilter: any) => ({ ...parentFilter, pageSize: event.target.value, page: 0 }));
  };

  const handleButtonDupplicate = (assessment: Assessment) => {
    let assessmentDupplicate: any = { ...assessment };
    delete assessmentDupplicate.is_deleted;
    delete assessmentDupplicate.id;
    delete assessmentDupplicate.updated_at;
    delete assessmentDupplicate.created_at;
    let questionDups: any[] = [];
    assessmentDupplicate.questions.map((ques: Question, index: number) => {
      let question = {
        title: ques.title,
        answers: ques.answers,
        assessment_id: ques.assessment_id,
        full_answers: ques.full_answers,
        image: ques.image,
        point: ques.point,
        type: ques.type
      };
      questionDups.push(question);
    });
    assessmentDupplicate.questions = questionDups;
    dispatch(fetchCreateAssessment({ asessment: assessmentDupplicate, filter }));
  };

  const handleButtonEdit = (id: number) => {
    dispatch(clearMsg(`fetchCreateAssessmentMsg`));
    dispatch(clearMsg(`fetchUpdateAssessmentMsg`));
    dispatch(fetchGetAssessmentById(id));
    setOpenEditDialog(true);
  };

  const handleButtonResultPlayer = (id: number) => {
    dispatch(clearMsg(`fetchCreateAssessmentMsg`));
    dispatch(clearMsg(`fetchUpdateAssessmentMsg`));
    dispatch(fetchGetAssessmentById(id));
    setOpenEditDialogResultPlayer(true);
  };

  const handleButtonChangeStatus = (id: number, status: any) => {
    setDataFocus({ id, status });
    setOpenChangeStatusDialog(true);
  };

  const handleChangeStatus = (status: number) => {
    dispatch(fetchUpdateStatusAssessment({ ...dataFocus, status }));
    setOpenChangeStatusDialog(false);
  };

  const handleDeleteAssessment = () => {
    dispatch(fetchDeleteAssessment({ id: dataFocus, filter }));
    setOpenConfirmDialog(false);
  };

  const handleButtonDelete = (id: number) => {
    setDataFocus(id);
    setOpenConfirmDialog(true);
  };

  return (
    <>
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 800 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Join key</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Number of questions</TableCell>
                <TableCell>Times</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!!assessments &&
                assessments.map((assessment, index) => {
                  const handledStatus = handleAssessmentStatus(assessment);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                      <TableCell>{index + filter.pageSize * filter.page + 1}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}> {assessment.join_key}</TableCell>
                      <TableCell>
                        <Typography noWrap>{assessment.title}</Typography>
                      </TableCell>
                      <TableCell>
                        {' '}
                        {assessment.number_of_question}{' '}
                        {assessment.number_of_question == 1 ? 'question' : 'questions'}
                      </TableCell>
                      <TableCell> {assessment.time} minus</TableCell>
                      <TableCell>
                        <Chip
                          size="small"
                          label={handledStatus.label}
                          color={handledStatus.color}
                          variant={handledStatus.variant}
                          onClick={() =>
                            handleButtonChangeStatus(assessment.id, assessment?.status)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Tooltip title="dupllicate">
                            <IconButton onClick={() => handleButtonDupplicate(assessment)}>
                              <ContentCopyIcon color="info" />
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
                          <Tooltip title="player">
                            <IconButton onClick={() => handleButtonResultPlayer(assessment.id)}>
                              <PeopleAltIcon color="info" />
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

      {openEditDialog && (
        <AssessmentEditDialog
          filter={filter}
          needOpen={openEditDialog}
          action={CRUD_ACTIONS.update}
          handleClose={() => setOpenEditDialog(false)}
          assessment={currentAssessment}
        />
      )}
      {openEditDialogResultPlayer && (
        <ResultPlayer
          needOpen={openEditDialogResultPlayer}
          handleClose={() => setOpenEditDialogResultPlayer(false)}
          assessment={currentAssessment}
        />
      )}

      {openConfirmDialog && (
        <ConfirmDeleteDialog
          needOpen={openConfirmDialog}
          setNeedOpen={setOpenConfirmDialog}
          title={MESSAGES.DELETE_ASSESSMENT}
          button1={{ title: MESSAGES.BTN_CANCEL, action: () => setOpenConfirmDialog(false) }}
          button2={{ title: MESSAGES.BTN_YES, action: handleDeleteAssessment }}
        />
      )}

      {openChangeStatusDialog && (
        <DialogSelect
          title={MESSAGES.CHANGE_STATUS_ASSESSMENT}
          open={openChangeStatusDialog}
          setOpen={setOpenChangeStatusDialog}
          action={handleChangeStatus}
          data={Object.entries(ASSESSMENT_STATUS).map((item) => item[1])}
          defaultValue={dataFocus.status}
        />
      )}
    </>
  );
};

const useStyles = makeStyles({});

export default AssessmentTable;
