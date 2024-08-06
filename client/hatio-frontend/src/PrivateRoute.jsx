import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const token = localStorage.getItem('refresh');
    
    return token ? Component : <Navigate to="/" />;
};

export default PrivateRoute;
