import { Building, Wrench, CheckCircle, AlertTriangle, User, Save, LucideIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardProps {
  user: {
    role: string;
    name: string;
  };
}

interface Chantier {
  _id: string;
  name: string;
  status: 'En cours' | 'Planifié' | 'Terminé' | 'En pause';
  progress: number;
}

interface Materiel {
  _id: string;
  name: string;
  status: 'Disponible' | 'En utilisation' | 'En maintenance' | 'Hors service';
}

interface StatCardProps {
  icon: React.ReactElement;
  title: string;
  value: number;
  subtext: string;
  color: string;
  iconColor: string;
}

interface PieChartData {
  name: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtext, color, iconColor }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
    <div className={`p-3 rounded-full ${color}`}>
      <div className={iconColor}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
    </div>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-2xl font-bold text-gray-100">{value}</p>
      <p className="text-xs text-gray-500">{subtext}</p>
    </div>
  </div>
);

const renderCustomLabel = (props: any) => {
  const { name, value, percent } = props;
  return `${name} ${(percent * 100).toFixed(0)}%`;
};

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [chantiers, setChantiers] = useState<Chantier[]>([]);
  const [materiel, setMateriel] = useState<Materiel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch both chantiers and materiel data in parallel
        const [chantiersRes, materielRes] = await Promise.all([
          axios.get('http://localhost:5000/api/chantiers', { headers }),
          axios.get('http://localhost:5000/api/materiel', { headers })
        ]);

        setChantiers(chantiersRes.data);
        setMateriel(materielRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Erreur lors de la récupération des données');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const equipmentStatusData: PieChartData[] = [
    { name: 'En utilisation', value: materiel.filter(e => e.status === 'En utilisation').length },
    { name: 'Disponible', value: materiel.filter(e => e.status === 'Disponible').length },
    { name: 'En maintenance', value: materiel.filter(e => e.status === 'En maintenance').length },
  ];

  const COLORS = ['#0ea5e9', '#22c55e', '#ef4444']; // sky, green, red

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Building />} 
          title="Chantiers Actifs" 
          value={chantiers.filter(s => s.status === 'En cours').length} 
          subtext={`sur un total de ${chantiers.length}`} 
          color="bg-sky-900/50" 
          iconColor="text-sky-400" 
        />
        <StatCard 
          icon={<Wrench />} 
          title="Matériels en Utilisation" 
          value={materiel.filter(e => e.status === 'En utilisation').length} 
          subtext={`sur un total de ${materiel.length}`} 
          color="bg-green-900/50" 
          iconColor="text-green-400" 
        />
        <StatCard 
          icon={<CheckCircle />} 
          title="Projets Terminés" 
          value={chantiers.filter(s => s.status === 'Terminé').length} 
          subtext="cette année" 
          color="bg-indigo-900/50" 
          iconColor="text-indigo-400" 
        />
        <StatCard 
          icon={<AlertTriangle />} 
          title="Alertes Maintenance" 
          value={materiel.filter(e => e.status === 'En maintenance').length} 
          subtext="action requise" 
          color="bg-red-900/50" 
          iconColor="text-red-400" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Avancement des Chantiers</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chantiers.filter(s => s.status === 'En cours')} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
              <YAxis unit="%" tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                cursor={{fill: 'rgba(55, 65, 81, 0.5)'}} 
                contentStyle={{ 
                  borderRadius: '0.75rem', 
                  border: 'none', 
                  backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                  color: '#d1d5db', 
                  backdropFilter: 'blur(4px)' 
                }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
              <Bar dataKey="progress" fill="#0ea5e9" name="Progression" barSize={30} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Statut du Matériel</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                data={equipmentStatusData} 
                cx="50%" 
                cy="50%" 
                labelLine={false} 
                outerRadius={100} 
                fill="#8884d8" 
                dataKey="value" 
                nameKey="name" 
                label={renderCustomLabel}
              >
                {equipmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '0.75rem', 
                  border: 'none', 
                  backgroundColor: 'rgba(17, 24, 39, 0.8)', 
                  color: '#d1d5db', 
                  backdropFilter: 'blur(4px)' 
                }} 
              />
              <Legend wrapperStyle={{ color: '#9ca3af' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;