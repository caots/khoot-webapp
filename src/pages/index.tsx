import { Meta } from 'src/layout/Meta';
import { Main } from '../templates/Main';
import Assessment from 'src/pages/assessment';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getToken } from 'src/utils/authService';
import { STORAGE_KEY } from 'src/config';
import { useSelector } from 'react-redux';

const Index = () => {
  const router = useRouter();

  const getUserDataMsg = useSelector((state: any) => state.authenSlice.fetchUserDataMsg);

  useEffect(() => {
    if (!getToken(STORAGE_KEY.ACCESS_TOKEN) || !!getUserDataMsg) {
      router.push('/take-assessment');
    }else router.push('/assessment');
  }, [getUserDataMsg]);
  return (
    <Main meta={<Meta title="Khoot" description="Khoot is play game or tools for school" />}>
      <></>
    </Main>
  );
};

export default Index;
