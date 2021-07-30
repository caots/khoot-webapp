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
  CircularProgress,
  Slider
} from '@material-ui/core';
import moment from 'moment';
import { StopRounded as SquareIcon, Close as CloseIcon } from '@material-ui/icons';
import TimerIcon from '@material-ui/icons/Timer';
import { useSelector, useDispatch } from 'react-redux';
import { clearMsg, fetchGetAssessmentTest } from 'src/features/assessment/assessmentSlice';
import { CRUD_ACTIONS, QUESTION_TYPE, SELECT_QUESTION_TYPE, STORAGE_KEY } from 'src/config';
import { MESSAGES } from 'src/config/message';
import { displayToast } from 'src/utils/commonService';
import _ from 'lodash';
import Assessment, { Question } from 'src/model/assessment';
import AssessmentApi from 'src/features/assessment/assessmentApi';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} />;
});

const TakeTestAssessment = ({ needOpen, handleClose, assessment }: any) => {
  const dispatch = useDispatch();

  const [questions, setQuestion]: any = useState([]);
  const [timeTest, setTimeTest]: any = useState('');
  const [countTime, setCountTime]: any = useState(-1);
  const [isTimeUp, setIsTimeUp]: any = useState(false);

  useEffect(() => {
    if (assessment) {
      const listQuestion = [...assessment.questions];
      listQuestion.forEach((question: Question, index: number) => {
        listQuestion[index] = Object.assign({}, question, {
          answers: JSON.parse(question.answers)
        });
      });
      listQuestion.forEach((question: Question, index: number) => {
        question.answers.forEach((ans: any) => (ans.status = false));
      });
      setQuestion(listQuestion);
      setCountTime(assessment.time * 60);
    }
  }, [assessment]);

  useEffect(() => {
    if (countTime >= 0 && assessment) {
      const timeShow = moment().add(assessment.time, 'minutes').add(2, 'seconds').valueOf();
      const countDown = setInterval(() => {
        // Get today's date and time
        const now = new Date().getTime();
        // Find the distance between now and the count down date
        const distance = timeShow - now;
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (distance < 0) {
          clearInterval(countDown);
          setIsTimeUp(true);
          setCountTime(0);
          console.log('time up');
          submitTestResult();
          return;
        }
        setIsTimeUp(false);
        setTimeTest(`${hours}h ${minutes}m ${seconds}s`);
      }, 1000);
    }
  }, [countTime]);

  const submitTestResult = () => {
    setIsTimeUp(true);
    submitTest();
  };

  const handleChangeSelectAnswer = (checked: any, question: Question) => {
    question.answers.forEach((ans: any, index: number) => {
      if (index === Number.parseInt(checked)) question.answers[index].status = true;
      else question.answers[index].status = false;
    });
    let listQuestion = [...questions];
    const index = listQuestion.findIndex((qs) => qs.id === question.id);
    listQuestion[index] = question;
    setQuestion(listQuestion);
  };

  const checkValueSelect = (question: Question) => {
    if (!question?.answers) return 0;
    if (typeof question?.answers == 'string') {
      question.answers = JSON.parse(question.answers);
    }
    const index = question.answers.findIndex((ans: any) => ans.status === true);
    return index;
  };

  const submitTest = () => {
    console.log(questions);
  };

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }} open={false}>
        <CircularProgress color="inherit" />
      </Backdrop>

      <Dialog open={needOpen} fullScreen>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} sx={{ mr: 3 }}>
              <CloseIcon />
            </IconButton>
            <Typography>Take Assessment</Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Container>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography
                style={{ marginTop: '30px' }}
                sx={{ fontSize: 20 }}
                color="text.secondary"
                gutterBottom
              >
                Questions
              </Typography>
              <div style={{ minWidth: '150px' }}>
                <Typography id="input-slider" gutterBottom>
                <TimerIcon style={{ fontSize: '35px' }} /> Time Take Test: {isTimeUp ? 'Time has Expired!' : timeTest}
                </Typography>
                {/* <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <TimerIcon style={{ fontSize: '35px' }} />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={typeof countTime === 'number' ? countTime : 0}
                      onChange={() => {}}
                      aria-labelledby="input-slider"
                    />
                  </Grid>
                </Grid> */}
              </div>
            </div>
            <Grid container spacing={3}>
              <Grid item xs={12} md={12}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Title assessment"
                  style={{ pointerEvents: 'none' }}
                  required
                  value={assessment?.title}
                  variant="outlined"
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
                  style={{ pointerEvents: 'none' }}
                  value={assessment?.description}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            {questions &&
              questions.map((question: Question, index: number) => (
                <Grid key={index} container spacing={3} style={{ marginTop: '10px' }}>
                  <Grid item xs={12} md={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Grid container spacing={3}>
                          <Grid item xs={12} md={12}>
                            <TextField
                              fullWidth
                              margin="normal"
                              label="Title Question"
                              style={{ pointerEvents: 'none' }}
                              multiline
                              rows={4}
                              required
                              defaultValue={question.title}
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
                            <div>
                              <img src={question?.image} width="100%" />
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
                              value={checkValueSelect(question)}
                              onChange={(event: any) =>
                                handleChangeSelectAnswer(event.target.value, question)
                              }
                            >
                              <FormControlLabel
                                value={0}
                                control={<Radio />}
                                label={question.answers[0]?.title}
                              />
                              <FormControlLabel
                                value={1}
                                control={<Radio />}
                                label={question.answers[1]?.title}
                              />
                              <FormControlLabel
                                value={2}
                                control={<Radio />}
                                label={question.answers[2]?.title}
                              />
                              <FormControlLabel
                                value={3}
                                control={<Radio />}
                                label={question.answers[3]?.title}
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ))}
            <Grid item container spacing={3} justifyContent="center" style={{ marginTop: '30px' }}>
              <Grid item>
                <Button onClick={handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button type="submit" variant="contained" onClick={() => submitTest()}>
                  Submit
                </Button>
              </Grid>
            </Grid>
          </Container>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TakeTestAssessment;
