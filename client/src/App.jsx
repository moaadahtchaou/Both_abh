import './App.css'
import Dashboard from './pages/Dashboard'
import Chantiers from './pages/Chantiers'
import Materiel from './pages/Materiel'
import Rapports from './pages/RapportView'
import Login from './pages/Login'
import AddChantier from './pages/AddChantier'
import EditChantier from './pages/EditChantier'
import AddMateriel from './pages/AddMateriel'
import EditMateriel from './pages/EditMateriel'
import AddChef from './pages/AddChef'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import AdminRoute from './components/auth/AdminRoute'
import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import LoadingSpinner from './components/common/LoadingSpinner';

// Function to fetch user data
const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const { data } = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Fetched user data:', data);
    return data;
};

function App() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const queryClient = useQueryClient();

    const { data: user, isLoading, isError } = useQuery({
        queryKey: ['user'],
        queryFn: fetchUser,
        enabled: !!localStorage.getItem('token'),
        retry: 1,
        staleTime: Infinity,
    });

    // Get the current active view from the pathname
    const getActiveView = () => {
        const path = location.pathname.substring(1) || 'dashboard';
        return path.charAt(0).toUpperCase() + path.slice(1);
    };

    // Protected Route wrapper
    const ProtectedRoute = ({ children }) => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
        }
        if (isError || !user) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
        return children;
    };

    // Public Route wrapper for login page - redirects to dashboard if already authenticated
    const PublicRoute = ({ children }) => {
        if (isLoading) {
            return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
        }
        if (user) {
            return <Navigate to="/dashboard" replace />;
        }
        return children;
    };

    // Layout wrapper for authenticated pages
    const AuthenticatedLayout = ({ children }) => (
        <div className="bg-gray-900 font-sans flex h-screen text-gray-200">
            <Sidebar user={user} activeView={getActiveView()} isSidebarOpen={isSidebarOpen} />
            <main className="flex-1 flex flex-col p-6 overflow-y-auto">
                <Header
                    user={user}
                    activeView={getActiveView()}
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />
                <div className="flex-1">
                    {children}
                </div>
            </main>
        </div>
    );

    return (
        <Routes>
            <Route path="/login" element={
                <PublicRoute>
                    <Login />
                </PublicRoute>
            } />

            <Route path="/" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <Dashboard user={user} />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <Dashboard user={user} />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/chantiers" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <Chantiers user={user} />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/chantiers/add" element={
                <ProtectedRoute>
                    <AdminRoute user={user}>
                        <AuthenticatedLayout>
                            <AddChantier />
                        </AuthenticatedLayout>
                    </AdminRoute>
                </ProtectedRoute>
            } />

            <Route path="/chantiers/edit/:id" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <EditChantier user={user} />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/materiel" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <Materiel user={user} />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/materiel/add" element={
                <ProtectedRoute>
                    <AdminRoute user={user}>
                        <AuthenticatedLayout>
                            <AddMateriel />
                        </AuthenticatedLayout>
                    </AdminRoute>
                </ProtectedRoute>
            } />

            <Route path="/materiel/edit/:id" element={
                <ProtectedRoute>
                    <AdminRoute user={user}>
                        <AuthenticatedLayout>
                            <EditMateriel user={user} />
                        </AuthenticatedLayout>
                    </AdminRoute>
                </ProtectedRoute>
            } />

            <Route path="/rapports" element={
                <ProtectedRoute>
                    <AuthenticatedLayout>
                        <Rapports />
                    </AuthenticatedLayout>
                </ProtectedRoute>
            } />

            <Route path="/chefs/add" element={
                <ProtectedRoute>
                    <AdminRoute user={user}>
                        <AuthenticatedLayout>
                            <AddChef />
                        </AuthenticatedLayout>
                    </AdminRoute>
                </ProtectedRoute>
            } />
        </Routes>
    );
}

export default App;