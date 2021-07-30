import React from 'react';
import { useRouter } from 'next/router';
import { Meta } from 'src/layout/Meta';
import { Main } from 'src/templates/Main';
import MakeTestAssessment from 'src/components/makeTestAssessment';

const TakeAssessment = (props: any) => {
  return (
    <Main meta={<Meta title="take assessment" description="Khoot | Take Assessment" />}>
      <MakeTestAssessment />
    </Main>
  );
};

export default TakeAssessment;
