import './App.css'
import Dashboard from './pages/Dashboard'
import Chantiers from './pages/Chantiers'
import Materiel from './pages/Materiel'
import Rapports from './pages/RapportView'
import Login from './pages/Login'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import {initialSites, initialEquipment, recentActivities}  from './store/db'
import { useState } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'

function App() {
  const [sites] = useState(initialSites);
  const [equipment] = useState(initialEquipment);
  const [activities] = useState(recentActivities);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isAuthenticated] = useState(false); // TODO: Implement proper auth state
  const location = useLocation();

  // Get the current active view from the pathname
  const getActiveView = () => {
    const path = location.pathname.substring(1) || 'dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };


  // Layout wrapper for authenticated pages
  const AuthenticatedLayout = ({ children }) => (
    <div className="bg-gray-900 font-sans flex h-screen text-gray-200">
      <Sidebar activeView={getActiveView()} isSidebarOpen={isSidebarOpen} />
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        <Header 
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
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard sites={sites} equipment={equipment} activities={activities} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Dashboard sites={sites} equipment={equipment} activities={activities} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/chantiers" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Chantiers sites={sites} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/materiel" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Materiel equipment={equipment} />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/rapports" element={
        <ProtectedRoute>
          <AuthenticatedLayout>
            <Rapports />
          </AuthenticatedLayout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App
