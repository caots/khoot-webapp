import React from 'react';
import { useRouter } from 'next/router';
import { Meta } from 'src/layout/Meta';
import AssessmentList from 'src/components/assessment/assessmentList';
import useCheckAuth from 'src/hooks/useCheckAuth';
import { Main } from 'src/templates/Main';

const Assessment = () => {
  const router = useRouter();
  useCheckAuth({ router, currentPage: `/app/blog/category` });

  return (
    <Main meta={<Meta title="assessment" description="Khoot | Assessment" />}>
      <AssessmentList />
    </Main>
  );
};

export default Assessment;
