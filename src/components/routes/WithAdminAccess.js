import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/authContext';

function WithAdminAccess() {
    const { user } = UserAuth();
    const navigate = useNavigate();

    const admin = user.typeAccount;
    return admin === "admin" ? <Outlet/> : navigate('/login');
}

export default WithAdminAccess
