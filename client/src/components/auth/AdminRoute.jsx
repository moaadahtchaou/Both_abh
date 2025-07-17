import { Navigate } from 'react-router-dom';

const AdminRoute = ({ user, children }) => {
    // If user is not admin, redirect to dashboard
    if (user?.role !== 'Admin') {
        return <Navigate to="/dashboard" replace />;
    }

    // If user is admin, render the protected component
    return children;
};

export default AdminRoute; 