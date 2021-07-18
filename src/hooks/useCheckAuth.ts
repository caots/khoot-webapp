import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsAuth, selectUserInfo, fetchGetUserData } from 'src/features/authen/authenSlide';
import { STORAGE_KEY } from 'src/config';
import { getToken } from 'src/utils/authService';

export default function useCheckAuth(data: any) {
  const dispatch = useDispatch();
  const { router, currentPage } = data;

  const isAuth = useSelector(selectIsAuth);
  const userData = useSelector(selectUserInfo);
  const isFetchingUserData = useSelector((state: any) => state.authenSlice.isFetchingUserInfo);
  const getUserDataMsg = useSelector((state: any) => state.authenSlice.fetchUserDataMsg);

  useEffect(() => {
    dispatch(fetchGetUserData());
  }, [dispatch]);

  useEffect(() => {
    // case reload page
    if (!getToken(STORAGE_KEY.ACCESS_TOKEN) || !!getUserDataMsg) {
      router.push('/login', { state: { previousPage: currentPage } });
    }
    // case logged out
    if (!getToken(STORAGE_KEY.ACCESS_TOKEN) && !isAuth && !isFetchingUserData) {
      router.push('/login', { state: { previousPage: currentPage } });
    }
  }, [currentPage, getUserDataMsg, isAuth, isFetchingUserData, router, userData]);
}
