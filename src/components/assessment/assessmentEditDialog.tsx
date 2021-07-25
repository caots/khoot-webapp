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
  Input,
  FormControl,
  MenuItem,
  CardContent,
  RadioGroup,
  Radio,
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
import NoteAddIcon from '@material-ui/icons/NoteAdd';
import { getToken } from 'src/utils/authService';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import { useSelector, useDispatch } from 'react-redux';
import {
  clearMsg,
  fetchCreateAssessment,
  fetchUpdateAssessment
} from 'src/features/assessment/assessmentSlice';
import { CRUD_ACTIONS, QUESTION_TYPE, SELECT_QUESTION_TYPE, STORAGE_KEY } from 'src/config';
import { MESSAGES } from 'src/config/message';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { displayToast } from 'src/utils/commonService';
import _ from 'lodash';
import Assessment, { Question } from 'src/model/assessment';
import AssessmentApi from 'src/features/assessment/assessmentApi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

const QuestionAnswer = (props: any) => {
  let question: Question = props.question;
  let index: number = props.index;
  return (
    <Box sx={{ display: 'flex' }}>
      <FormControlLabel value={index} control={<Radio />} label={''} />{' '}
      <TextField
        fullWidth
        style={{ width: '100%' }}
        margin="normal"
        label="Title Answer"
        required
        defaultValue={question?.full_answers && question.full_answers[index]?.title}
        onChange={(e: any) => {
          question.full_answers[index].title = e.target.value;
        }}
        variant="outlined"
      />
    </Box>
  );
};

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
  const [uploadedImage, setUploadedImage]: any[] = useState([]);
  const [questions, setQuestion]: any = useState([
    {
      title: '',
      type: QUESTION_TYPE.MULTICHOICE,
      answers: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }],
      full_answers: [
        { title: '', status: true },
        { title: '', status: false },
        { title: '', status: false },
        { title: '', status: false }
      ],
      point: 0,
      image: ''
    } as Question
  ]);

  useEffect(() => {
    if (assessment) {
      const listQuestion = [...assessment.questions];
      let images: any[] = [...uploadedImage];
    
      listQuestion.forEach((question: Question, index: number) => {
        listQuestion[index] = Object.assign({}, question, {
          answers: JSON.parse(question.answers)
        });
        listQuestion[index] = Object.assign({}, question, {
          full_answers: JSON.parse(question.full_answers)
        });
        images[index] = question.image;
      });
      setUploadedImage(images);
      setQuestion(listQuestion);
    }
  }, [assessment]);

  const successMsg =
    action === CRUD_ACTIONS.create ? MESSAGES.CREATE_SUCCESS : MESSAGES.UPDATE_SUCCESS;
  const msgName =
    action === CRUD_ACTIONS.create ? `fetchCreateAssessmentMsg` : `fetchUpdateAssessmentMsg`;

  useEffect(() => {
    setMsg(action === CRUD_ACTIONS.create ? fetchCreateAssessmentMsg : fetchUpdateAssessmentMsg);
  }, [action, fetchCreateAssessmentMsg, fetchUpdateAssessmentMsg]);

  // Display toast on save
  useEffect(() => {
    if (
      (!isFetchingCreateAssessment && fetchCreateAssessmentMsg) ||
      (!isFetchingUpdateAssessment && fetchUpdateAssessmentMsg)
    ) {
      displayToast(
        msg,
        successMsg,
        () => handleClose(),
        () => dispatch(clearMsg(msgName))
      );
    }
  }, [
    dispatch,
    fetchCreateAssessmentMsg,
    fetchUpdateAssessmentMsg,
    isFetchingCreateAssessment,
    msg,
    successMsg
  ]);

  const handleAddImage = async (e: any, index: number) => {
    const imgUrl = (
      await AssessmentApi.uploadImage(e.target.files[0], getToken(STORAGE_KEY.ACCESS_TOKEN))
    ).data?.url;
    let images: any[] = [...uploadedImage];
    images[index] = imgUrl;
    setUploadedImage(images);
  };

  const handleChangeSelectAnswer = (checked: any, question: Question) => {
    question.full_answers.map((ans: any, index: number) => {
      if (index === Number.parseInt(checked)) question.full_answers[index].status = true;
      else question.full_answers[index].status = false;
    });
    let listQuestion = [...questions];
    const index = listQuestion.findIndex((qs) => qs.id === question.id);
    listQuestion[index] = question;
    setQuestion(listQuestion);
  };

  const addNewQuestion = () => {
    const newQuestion = {
      title: '',
      type: QUESTION_TYPE.MULTICHOICE,
      answers: [{ title: '' }, { title: '' }, { title: '' }, { title: '' }],
      full_answers: [
        { title: '', status: true },
        { title: '', status: false },
        { title: '', status: false },
        { title: '', status: false }
      ],
      point: 0,
      image: ''
    } as Question;
    setUploadedImage([...uploadedImage, '']);
    setQuestion([...questions, newQuestion]);
  };

  const removeQuestion = (question: Question, index: number) => {
    if (questions.length <= 1) return;
    let listQuestion = [...questions];
    let images = [...uploadedImage];
    if (index >= 0){
      listQuestion.splice(index, 1);
      images.splice(index, 1);
    }
    setUploadedImage(images);
    setQuestion(listQuestion);
  };

  const handleFormSubmit = (data: any, formik: any) => {
    const questionsSave = [...questions];
    questionsSave.map((question: Question, index: number) => {
      let answers: any = [];
      question.full_answers.forEach((ans: any) => {
        answers.push({ title: ans.title });
      });
      questionsSave[index] = question;
      question.answers = JSON.stringify(answers);
      question.full_answers = JSON.stringify(question.full_answers);
      question.image = uploadedImage[index] || "";
    });
    const newAssessment = {
      ...data,
      number_of_question: questionsSave.length,
      questions: questionsSave
    };
    
    if (action === CRUD_ACTIONS.create) {
      newAssessment.user_id = filter.userId;
      dispatch(fetchCreateAssessment({ asessment: newAssessment, filter }));
    } else if (action === CRUD_ACTIONS.update) {
      delete newAssessment.is_deleted;
      newAssessment.questions.forEach((question: Question, index: number) => {
        delete question.id;
        delete question.created_at;
        delete question.updated_at;
      });
      dispatch(fetchUpdateAssessment({ asessment: newAssessment, filter }));
    }
  };

  const checkValueSelect = (question: Question) => {
    if (!question?.full_answers) return 0;
    if (typeof question?.full_answers == 'string') {
      question.answers = JSON.parse(question.answers);
      question.full_answers = JSON.parse(question.full_answers);
    }
    const index = question.full_answers.findIndex((ans: any) => ans.status === true);
    return index || 0;
  };

  const CustomFormik = ({ initialValues }: any) => {
    const formatedInitialValues = _.omit(
      {
        ...initialValues
      },
      ['updated_at', 'created_at', 'join_key', 'status']
    );
    return (
      <>
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
                <Grid item container spacing={3} justifyContent="flex-start">
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
        <Typography
          style={{ marginTop: '30px' }}
          sx={{ fontSize: 20 }}
          color="text.secondary"
          gutterBottom
        >
          Questions
        </Typography>
        {questions &&
          questions.map((question: Question, index: number) => (
            <Grid key={index} container spacing={3} style={{ marginTop: '10px' }}>
              <Grid item xs={6} md={9}>
                <Card variant="outlined">
                  <CardContent>
                    <Grid container spacing={3}>
                      <Grid item xs={6} md={9}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Title Question"
                          onChange={(e: any) => {
                            question.title = e.target.value;
                          }}
                          multiline
                          rows={4}
                          required
                          defaultValue={question.title}
                          variant="outlined"
                        />
                      </Grid>

                      <Grid item xs={6} md={3}>
                        <TextField
                          fullWidth
                          margin="normal"
                          label="Weight"
                          type="number"
                          onChange={(e: any) => {
                            question.point = e.target.value;
                          }}
                          required
                          defaultValue={question.point}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid
                        item
                        xs={12}
                        md={12}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          position: 'relative'
                        }}
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          component="label"
                          style={{ position: 'absolute', right: '5px' }}
                        >
                          <Input
                            sx={{ display: 'none' }}
                            type="file"
                            onChange={(e: any) => handleAddImage(e, index)}
                          />
                          <NoteAddIcon sx={{ fontSize: 20 }} />
                        </Button>
                        <div>
                          <img src={uploadedImage[index]} width="100%" />
                        </div>
                      </Grid>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        position: 'relative',
                        marginTop: '30px'
                      }}
                    >
                      <FormControl component="fieldset" style={{ width: '100%' }}>
                        <RadioGroup
                          aria-label="gender"
                          name="controlled-radio-buttons-group"
                          defaultValue={checkValueSelect(question)}
                          onChange={(event: any) =>
                            handleChangeSelectAnswer(event.target.value, question)
                          }
                        >
                          <QuestionAnswer question={question} index={0} />
                          <QuestionAnswer question={question} index={1} />
                          <QuestionAnswer question={question} index={2} />
                          <QuestionAnswer question={question} index={3} />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} md={3}>
                {/* <FormControl sx={{ marginLeft: '20px', minWidth: 150 }}>
                  <InputLabel id="demo-simple-select-autowidth-label">Type</InputLabel>
                  <Select
                    labelId="demo-simple-select-autowidth-label"
                    id="demo-simple-select-autowidth"
                    onChange={(e: any) => changeTypeQuestion(e.target.value, question)}
                    autoWidth
                    label="Type"
                  >
                    {SELECT_QUESTION_TYPE.map((data) => (
                      <MenuItem value={data.id}>{data.title}</MenuItem>
                    ))}
                  </Select>
                </FormControl> */}
                <IconButton
                  aria-label="create question"
                  style={{
                    marginLeft: '0px',
                    height: 'max-content'
                  }}
                  onClick={addNewQuestion}
                >
                  <AddCircleOutlineIcon sx={{ fontSize: 40 }} />
                </IconButton>
                <IconButton
                  aria-label="create question"
                  style={{ marginLeft: '10px', height: 'max-content' }}
                  onClick={() => removeQuestion(question, index)}
                >
                  <RemoveCircleOutlineIcon sx={{ fontSize: 40 }} />
                </IconButton>
              </Grid>
            </Grid>
          ))}
      </>
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
