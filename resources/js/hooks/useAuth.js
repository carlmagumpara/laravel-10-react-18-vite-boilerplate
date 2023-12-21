import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../redux/reducers/user';
import { selectToken } from '../redux/reducers/token';

export const useAuth = () => {
  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const user = useSelector(selectUser);

  return {
    isAuthenticated: (token && user) ? true : false,
    isEmailVerified: user?.email_verified_at ? true : false,
    isAdmin: user?.role_id === 1,
    isClient: user?.role_id === 2,
    getId: user?.id,
    getName: `${user?.first_name ?? ''} ${user?.last_name ?? ''}`,
    getFirstName: user?.first_name,
    getLastName: user?.last_name,
    getAvatar: user?.photo,
    getEmail: user?.email,
    getRoleId: user?.role_id,
    getIsSuper: user?.is_super,
    getToken: token,
    getUser: user,
    getStatus: user?.status,
    logout: () => dispatch({ type: 'USER_LOGOUT' }),
  }
}