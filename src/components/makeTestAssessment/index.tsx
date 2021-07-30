import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import {
  Grid,
  Card,
  CardContent,
  CardActions,
  Box,
  Container,
  Button,
  TextField
} from '@material-ui/core';
import Link from 'next/link';
import Logo from 'src/components/logo';
import TakeTestAssessment from './takeTestAssessment';
import { clearMsg, fetchGetAssessmentTest } from 'src/features/assessment/assessmentSlice';
import Assessment, { Question } from 'src/model/assessment';
import { MESSAGES } from 'src/config/message';
import { displayToast } from 'src/utils/commonService';
import Image from 'next/image'

const MakeTestAssessment = (props: any) => {
  const dispatch = useDispatch();

  const [msg, setMsg] = useState('');
  const [openTakeTest, setOpenTakeTest]: any = useState(false);
  const [joinAssessment, setJoinAssessment]: any = useState({
    name: '',
    joinKey: ''
  });

  const successMsg = MESSAGES.JOIN_TEST;
  const msgName = `fetchingGetAssessmentTestMgs`;

  const isFetchingGetAssessmentById: number = useSelector(
    (state: any) => state.assessmentSlice.isFetchingGetAssessmentById
  );
  const fetchingGetAssessmentTestMgs: any = useSelector(
    (state: any) => state.assessmentSlice.fetchingGetAssessmentTestMgs
  );
  const currentAssessment: Assessment = useSelector(
    (state: any) => state.assessmentSlice.currentAssessment
  );

  useEffect(() => {
    setMsg(fetchingGetAssessmentTestMgs);
  }, [fetchingGetAssessmentTestMgs]);

  // Display toast on save
  useEffect(() => {
    if (!isFetchingGetAssessmentById && fetchingGetAssessmentTestMgs) {
      displayToast(
        msg,
        successMsg,
        () => {},
        () => dispatch(clearMsg(msgName))
      );
    }
  }, [dispatch, fetchingGetAssessmentTestMgs, isFetchingGetAssessmentById, msg, successMsg]);

  const handleSubmit = () => {
    dispatch(fetchGetAssessmentTest(joinAssessment));
    setOpenTakeTest(true);
  };
  return (
    <Grid container>
      {currentAssessment && (
        <TakeTestAssessment
          needOpen={openTakeTest}
          handleClose={() => setOpenTakeTest(false)}
          assessment={currentAssessment}
        />
      )}
      <Grid item sm={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            <Card sx={{ maxWidth: 345 }}>
              <CardContent>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Logo />
                </div>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Name"
                      name="name"
                      onChange={(e: any) => {
                        const value = e.target.value;
                        //let join = { ...joinAssessment };
                        joinAssessment.name = value;
                        //setJoinAssessment(join);
                      }}
                      required
                      defaultValue={joinAssessment.name}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12} md={12}>
                    <TextField
                      fullWidth
                      margin="normal"
                      label="Key"
                      name="joinKey"
                      onChange={(e: any) => {
                        const value = e.target.value;
                        // let join = { ...joinAssessment };
                        joinAssessment.joinKey = value;
                        //setJoinAssessment(join);
                      }}
                      required
                      defaultValue={joinAssessment.joinKey}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item container spacing={3} justifyContent="flex-start">
                    <Grid item>
                      <Button type="submit" variant="contained" onClick={handleSubmit}>
                        Join Asessment
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </Grid>
    </Grid>
  );
};

export default MakeTestAssessment;
