import { Building, Wrench, CheckCircle, AlertTriangle, User, Save } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import React, { useState, useEffect } from 'react';


const StatCard = ({ icon, title, value, subtext, color, iconColor }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg flex items-center space-x-4">
      <div className={`p-3 rounded-full ${color}`}>
          {React.cloneElement(icon, { className: iconColor })}
      </div>
      <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-100">{value}</p>
          <p className="text-xs text-gray-500">{subtext}</p>
      </div>
  </div>
);

const Dashboard = ({ user, sites, equipment, activities }) => {
  const equipmentStatusData = [
      { name: 'En utilisation', value: equipment.filter(e => e.status === 'En utilisation').length },
      { name: 'Disponible', value: equipment.filter(e => e.status === 'Disponible').length },
      { name: 'En maintenance', value: equipment.filter(e => e.status === 'En maintenance').length },
  ];
  const COLORS = ['#0ea5e9', '#22c55e', '#ef4444']; // sky, green, red




  return (
      <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard icon={<Building size={24} />} title="Chantiers Actifs" value={sites.filter(s => s.status === 'En cours').length} subtext={`sur un total de ${sites.length}`} color="bg-sky-900/50" iconColor="text-sky-400" />
              <StatCard icon={<Wrench size={24} />} title="Matériels en Utilisation" value={equipment.filter(e => e.status === 'En utilisation').length} subtext={`sur un total de ${equipment.length}`} color="bg-green-900/50" iconColor="text-green-400" />
              <StatCard icon={<CheckCircle size={24} />} title="Projets Terminés" value={sites.filter(s => s.status === 'Terminé').length} subtext="cette année" color="bg-indigo-900/50" iconColor="text-indigo-400" />
              <StatCard icon={<AlertTriangle size={24} />} title="Alertes Maintenance" value={equipment.filter(e => e.status === 'En maintenance').length} subtext="action requise" color="bg-red-900/50" iconColor="text-red-400" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              <div className="lg:col-span-3 bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Avancement des Chantiers</h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={sites.filter(s => s.status === 'En cours')} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" vertical={false} />
                          <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                          <YAxis unit="%" tick={{ fill: '#9ca3af' }} />
                          <Tooltip cursor={{fill: 'rgba(55, 65, 81, 0.5)'}} contentStyle={{ borderRadius: '0.75rem', border: 'none', backgroundColor: 'rgba(17, 24, 39, 0.8)', color: '#d1d5db', backdropFilter: 'blur(4px)' }} />
                          <Legend wrapperStyle={{ color: '#9ca3af' }} />
                          <Bar dataKey="progress" fill="#0ea5e9" name="Progression" barSize={30} radius={[8, 8, 0, 0]} />
                      </BarChart>
                  </ResponsiveContainer>
              </div>
              <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-200 mb-4">Statut du Matériel</h3>
                  <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                          <Pie data={equipmentStatusData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelStyle={{ fill: '#d1d5db', fontSize: '12px' }}>
                              {equipmentStatusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '0.75rem', border: 'none', backgroundColor: 'rgba(17, 24, 39, 0.8)', color: '#d1d5db', backdropFilter: 'blur(4px)' }} />
                          <Legend wrapperStyle={{ color: '#9ca3af' }} />
                      </PieChart>
                  </ResponsiveContainer>
              </div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Activité Récente</h3>
              <div className="space-y-4">
                  {activities.map(activity => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 hover:bg-gray-700/50 rounded-lg">
                           <div className="bg-gray-700 p-2 rounded-full"><User size={16} className="text-gray-400" /></div>
                          <div>
                              <p className="text-sm text-gray-300"><span className="font-semibold text-gray-100">{activity.user}</span> {activity.action} <span className="font-semibold text-sky-400">{activity.target}</span>.</p>
                              <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </div>
  );
};

export default Dashboard;