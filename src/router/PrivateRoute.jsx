import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { state } = useLocation();

  if (state) localStorage.setItem('stateLogin', JSON.stringify(state));

  const localState = localStorage.getItem('stateLogin');
  const localStateParse = JSON.parse(localState);

  if (localStateParse && localStateParse.logged) {
    return children;
  } else {
    return <Navigate to="/login" state={{ from: '/' }} replace={true} />;
  }
};

export default PrivateRoute;
