import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/authContext';

const ProtectedRoute = () => {
  const { user } = UserAuth();
  const navigate = useNavigate();
  return user ? <Outlet/> : navigate('/login');
};

export default ProtectedRoute;
