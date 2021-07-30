import { Meta } from 'src/layout/Meta';
import { Main } from '../templates/Main';
import Assessment from 'src/pages/assessment';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const Index = () => {
  const router = useRouter();
  useEffect(() => {
    router.push('/take-assessment');
  }, []);
  return (
    <Main meta={<Meta title="Khoot" description="Khoot is play game or tools for school" />}>
      <></>
    </Main>
  );
};

export default Index;
