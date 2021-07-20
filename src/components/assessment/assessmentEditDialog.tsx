import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Grid,
  Container,
  Button,
  Box,
  Card,
  Select,
  InputLabel,
  OutlinedInput,
  Checkbox,
  CardContent,
  CardMedia,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Slide,
  InputAdornment,
  Backdrop,
  CircularProgress
} from '@material-ui/core';
import { StopRounded as SquareIcon, Close as CloseIcon } from '@material-ui/icons';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import { clearMsg } from 'src/features/assessment/assessmentSlice';
import { CRUD_ACTIONS } from 'src/config';
import { MESSAGES } from 'src/config/message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { displayToast } from 'src/utils/commonService';
import _ from 'lodash';
import Assessment, { Question } from 'src/model/assessment';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

const AssessmentEditDialog = ({ needOpen, handleClose, action, assessment, filter }: any) => {
  const dispatch = useDispatch();
  // global state
  const fetchCreateAssessmentMsg = useSelector(
    (state: any) => state.assessmentSlice.fetchCreateAssessmentMsg
  );
  const fetchUpdateAssessmentMsg = useSelector(
    (state: any) => state.assessmentSlice.fetchUpdateAssessmentMsg
  );
  const isFetchingCreateAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingCreateAssessment
  );
  const isFetchingUpdateAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingUpdateAssessment
  );
  // local state
  const [msg, setMsg] = useState('');
  const [questions, setQuestion]: any = useState([]);

  useEffect(() => {
    if (assessment) setQuestion(assessment.questions);
  }, [assessment]);

  const successMsg =
    action === CRUD_ACTIONS.create ? MESSAGES.CREATE_SUCCESS : MESSAGES.UPDATE_SUCCESS;
  const msgName =
    action === CRUD_ACTIONS.create ? `fetchCreateAssessmentMsg` : `fetchUpdateAssessmentMsg`;

  const handleFormSubmit = (data: any, formik: any) => {
    const newAssessment = { ...data, number_of_question: data.questions.length };
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    if (action === CRUD_ACTIONS.create) {
      //dispatch(fetchCreateProduct({ product: data, filter }));
    } else if (action === CRUD_ACTIONS.update) {
      //dispatch(fetchUpdateProduct({ product: { ...data, id: product?.id }, filter }));
    }
  };

  useEffect(() => {
    setMsg(action === CRUD_ACTIONS.create ? fetchCreateAssessmentMsg : fetchUpdateAssessmentMsg);
  }, [action, fetchCreateAssessmentMsg, fetchUpdateAssessmentMsg]);

  // Display toast on save
  useEffect(() => {
    ((!isFetchingCreateAssessment && !!fetchCreateAssessmentMsg) ||
      (!isFetchingUpdateAssessment && !!fetchUpdateAssessmentMsg)) &&
      displayToast(
        msg,
        successMsg,
        () => handleClose(),
        () => dispatch(clearMsg(msgName))
      );
  }, [
    dispatch,
    fetchCreateAssessmentMsg,
    fetchUpdateAssessmentMsg,
    isFetchingCreateAssessment,
    isFetchingUpdateAssessment,
    msg,
    msgName,
    successMsg
  ]);

  const CustomFormik = ({ initialValues }: any) => {
    const formatedInitialValues = _.omit(
      {
        ...initialValues
      },
      ['updated_at', 'created_at', 'join_key', 'status']
    );
    return (
      <Formik
        initialValues={formatedInitialValues}
        validationSchema={Yup.object().shape({
          title: Yup.string().max(255, `Title is too long`).required(`Title is required`),
          time: Yup.number().integer(`Time is not correct`).required(`Time is required`)
        })}
        onSubmit={handleFormSubmit}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values
        }: any) => (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title assessment"
                  name="title"
                  error={Boolean(touched.title && errors.title)}
                  helperText={touched.title && errors.title}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  value={values.title}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Time"
                  name="time"
                  type="number"
                  error={Boolean(touched.time && errors.time)}
                  helperText={touched.time && errors.time}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  required
                  value={values.time}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Minus: </InputAdornment>
                  }}
                />
              </Grid>

              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Description"
                  name="description"
                  type="text"
                  multiline
                  rows={12}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.description}
                  variant="outlined"
                />
              </Grid>

              <Typography
                style={{ margin: '30px' }}
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Questions
              </Typography>
              {questions.lenght > 0 ? (
                questions.map((question: Question, index: number) => (
                  <Grid container spacing={3} style={{ margin: '30px', marginTop: '10px' }}>
                    <Box sx={{ width: '80%' }}>
                      <Card variant="outlined">
                        <CardContent>
                          <Grid container spacing={3}>
                            <Grid item xs={6} md={9}>
                              <TextField
                                fullWidth
                                margin="normal"
                                label="Title Question"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                                value={question.title}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid item xs={6} md={3}>
                              <TextField
                                fullWidth
                                margin="normal"
                                label="Weight"
                                name="point"
                                type="number"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                required
                                value={question.point}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12} md={12}>
                              <CardMedia
                                sx={{
                                  height: 0,
                                  paddingTop: '56.25%'
                                }}
                                image="https://next.material-ui.com/static/images/cards/paella.jpg"
                                title="image question"
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Box>
                    <IconButton
                      aria-label="create question"
                      style={{ marginLeft: '30px', height: 'max-content' }}
                    >
                      <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                    </IconButton>
                  </Grid>
                ))
              ) : (
                <Grid container spacing={3} style={{ margin: '30px', marginTop: '10px' }}>
                  <Box sx={{ width: '80%' }}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={6} md={9}>
                            <TextField
                              fullWidth
                              margin="normal"
                              label="Title Question"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              required
                              value={''}
                              variant="outlined"
                            />
                          </Grid>

                          <Grid item xs={6} md={3}>
                            <TextField
                              fullWidth
                              margin="normal"
                              label="Weight"
                              name="point"
                              type="number"
                              onBlur={handleBlur}
                              onChange={handleChange}
                              required
                              value={0}
                              variant="outlined"
                            />
                          </Grid>
                          <Grid item xs={12} md={12}>
                            <CardMedia
                              sx={{
                                height: 0,
                                paddingTop: '56.25%'
                              }}
                              image=""
                              title="image question"
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Box>
                  <IconButton
                    aria-label="create question"
                    style={{ marginLeft: '30px', height: 'max-content' }}
                  >
                    <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                  <IconButton
                    aria-label="create question"
                    style={{ marginLeft: '10px', height: 'max-content' }}
                  >
                    <RemoveCircleOutlineIcon sx={{ fontSize: 40 }} />
                  </IconButton>
                </Grid>
              )}

              <Grid item container spacing={3} justifyContent="flex-end">
                <Grid item>
                  <Button onClick={handleClose}>Cancel</Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained">
                    Save
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    );
  };

  return (
    <>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}
        open={isFetchingCreateAssessment || isFetchingUpdateAssessment}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={needOpen} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} sx={{ mr: 3 }}>
              <CloseIcon />
            </IconButton>
            <Typography>
              {action === CRUD_ACTIONS.create ? `Create Assessment` : `Edit Assessment`}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Container>
            {action === CRUD_ACTIONS.create ? (
              <CustomFormik
                initialValues={
                  {
                    title: '',
                    time: 0,
                    description: '',
                    questions: []
                  } as Assessment
                }
              />
            ) : (
              !!assessment && <CustomFormik initialValues={assessment} />
            )}
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AssessmentEditDialog;
