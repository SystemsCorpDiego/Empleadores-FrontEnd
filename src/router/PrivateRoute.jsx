import { Navigate, useLocation } from 'react-router-dom';
import localStorageService from '@/components/localStorage/localStorageService';
import { useSearchParams } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { state } = useLocation();

  if (state) localStorageService.setLoguin(state);

  if (localStorageService.isLogged()) {
    return children;
  } else {
    const [searchParams] = useSearchParams();
    const redirectParam = searchParams.get('redirect');
    if (redirectParam && redirectParam != '')
      return (
        <Navigate
          to={`/login?redirect=${redirectParam}`}
          state={{ from: '/' }}
          replace={true}
        />
      );

    return <Navigate to="/login" state={{ from: '/' }} replace={true} />;
  }
};

export default PrivateRoute;
