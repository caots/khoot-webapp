import { Grid, Paper, styled, Skeleton, Box, Container } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Profile from './profile';
import AssessmentTable from './assessmentTable';
import { selectUserInfo } from 'src/features/authen/authenSlice';
import { PAGE_SIZE, CRUD_ACTIONS } from 'src/config';
import SearchAssessment from 'src/model/searchParams';
import AssessmentToolbar from './assessmentToolbar';
import { clearMsg, fetchGetAllAssessment } from 'src/features/assessment/assessmentSlice';
import Assessment from 'src/model/assessment';
import User from 'src/model/user';
import AssessmentEditDialog from './assessmentEditDialog';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}));

const AssessmentList = () => {
  const dispatch = useDispatch();

  const assessmentCount: number = useSelector(
    (state: any) => state.assessmentSlice.assessmentCount
  );
  const assessments: Assessment[] = useSelector((state: any) => state.assessmentSlice.assessments);
  const isFetchingGetAllAssessment = useSelector(
    (state: any) => state.assessmentSlice.isFetchingGetAllAssessment
  );
  const userData: User = useSelector(selectUserInfo);

  const [openCreateAssessmentDialog, setOpenCreateAssessmentDialog]: any = useState(false);
  const [filter, setFilter] = useState({
    userId: 0,
    title: '',
    page: 0,
    pageSize: PAGE_SIZE.ASSESMENT,
    from_date: '',
    to_date: ''
  } as SearchAssessment);

  useEffect(() => {
    if (userData) {
      setFilter({ ...filter, userId: userData.id });
    }
  }, [userData]);

  useEffect(() => {
    dispatch(fetchGetAllAssessment(filter));
  }, [dispatch, filter]);

  return (
    <Grid container>
      <Grid item lg={8} sm={12} sx={{ marginLeft: '15px', marginRight: '15px' }}>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            {userData && (
              <AssessmentToolbar
                filter={filter}
                setFilter={setFilter}
                handleCreateButton={() => {
                  dispatch(clearMsg(`fetchCreateAssessmentMsg`));
                  dispatch(clearMsg(`fetchUpdateAssessmentMsg`));
                  setOpenCreateAssessmentDialog(true);
                }}
              />
            )}
            <Box sx={{ pt: 3 }}>
              <Grid container spacing={3}>
                {isFetchingGetAllAssessment ? (
                  <Skeleton variant="rectangular" width={'100%'} height={600} />
                ) : (
                  <AssessmentTable
                    assessments={assessments}
                    assessmentCount={assessmentCount}
                    filter={filter}
                    setFilter={setFilter}
                  />
                )}
              </Grid>
            </Box>
          </Container>
        </Box>
      </Grid>
      <Grid item lg={3} sm={12}>
        <Item>{userData && <Profile userData={userData} />}</Item>
      </Grid>

      <AssessmentEditDialog
        filter={filter}
        needOpen={openCreateAssessmentDialog}
        action={CRUD_ACTIONS.create}
        handleClose={() => setOpenCreateAssessmentDialog(false)}
      />
    </Grid>
  );
};

export default AssessmentList;
