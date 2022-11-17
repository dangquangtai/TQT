import React from 'react';
import { Redirect } from 'react-router-dom';

import useAuth from '../../hooks/useAuth';

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();
  if (!isLoggedIn) {
    return <Redirect to="/login" />;
  }

  return children;
};

export default AuthGuard;
