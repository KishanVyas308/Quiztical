import { Navigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import userAtom from '../../atom/authAtom/userAtom';

export const AuthProtectedRoute = () => {
  const user = useRecoilValue(userAtom);

  return user
    ? <Outlet />
    : <Navigate to="/login" replace />;
};