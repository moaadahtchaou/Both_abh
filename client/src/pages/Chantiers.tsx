import React from 'react';
import { HardHat, MapPin, Calendar, TrendingUp, Eye, Edit, Trash2, Filter, Search, Plus, BarChart3 } from "lucide-react";
import StatusChip from "../components/common/StatusChip";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const SiteProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-600 rounded-full h-2.5">
    <div 
      className="bg-gradient-to-r from-sky-400 to-sky-600 h-2.5 rounded-full transition-all duration-300" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const SiteCard = ({ site, onViewDetails, onEdit, onDelete }) => (
  <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-sky-900/50 rounded-lg">
          <HardHat className="text-sky-400" size={20} />
        </div>
        <div>
          <h4 className="font-semibold text-gray-100 text-lg">{site.name}</h4>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <MapPin size={14} className="mr-1" />
            {site.location}
          </div>
        </div>
      </div>
      <StatusChip status={site.status} />
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Progression</span>
        <span className="text-gray-300 font-medium">{site.progress}%</span>
      </div>
      <SiteProgressBar progress={site.progress} />
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-400">
          <Calendar size={14} className="mr-1" />
          Début: {new Date(site.startDate).toLocaleDateString('fr-FR')}
        </div>
        <div className="flex items-center text-gray-400">
          <Calendar size={14} className="mr-1" />
          Fin: {new Date(site.endDate).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
      <button 
        onClick={() => onViewDetails(site)}
        className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors"
      >
        <Eye size={16} />
        <span className="text-sm">Détails</span>
      </button>
      <div className="flex space-x-2">
        <button 
          onClick={() => onEdit(site)}
          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(site)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const Chantiers = ({ sites }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  // Filter and sort sites
  const filteredSites = sites
    .filter(site => {
      const matchesSearch = site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          site.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || site.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'progress':
          return b.progress - a.progress;
        case 'startDate':
          return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        default:
          return 0;
      }
    });

  const handleViewDetails = (site) => {
    console.log('View details for:', site);
  };

  const handleEdit = (site) => {
    console.log('Edit site:', site);
  };

  const handleDelete = (site) => {
    console.log('Delete site:', site);
  };

  const getStatusCounts = () => {
    return {
      total: sites.length,
      enCours: sites.filter(s => s.status === 'En cours').length,
      termine: sites.filter(s => s.status === 'Terminé').length,
      enAttente: sites.filter(s => s.status === 'En attente').length,
    };
  };

  const statusCounts = getStatusCounts();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/50 rounded-lg">
              <HardHat className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Chantiers</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-900/50 rounded-lg">
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">En cours</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.enCours}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-900/50 rounded-lg">
              <BarChart3 className="text-indigo-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Terminés</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.termine}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-900/50 rounded-lg">
              <Calendar className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">En attente</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.enAttente}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-xl font-semibold text-gray-100">Gestion des Chantiers</h3>
          <button 
            onClick={() => navigate('/chantiers/add')}
            className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Plus size={18} />
            <span>Nouveau Chantier</span>
          </button>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un chantier..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          
          <div className="flex space-x-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="En cours">En cours</option>
              <option value="Terminé">Terminé</option>
              <option value="En attente">En attente</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="name">Nom</option>
              <option value="progress">Progression</option>
              <option value="startDate">Date de début</option>
            </select>
            
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1 rounded ${viewMode === 'grid' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Grille
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded ${viewMode === 'table' ? 'bg-sky-600 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                Tableau
              </button>
            </div>
          </div>
        </div>

        {/* Content based on view mode */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSites.map(site => (
              <SiteCard 
                key={site.id} 
                site={site} 
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">Nom du Chantier</th>
                  <th scope="col" className="px-6 py-3">Localisation</th>
                  <th scope="col" className="px-6 py-3">Statut</th>
                  <th scope="col" className="px-6 py-3">Progression</th>
                  <th scope="col" className="px-6 py-3">Date de début</th>
                  <th scope="col" className="px-6 py-3">Date de fin</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSites.map(site => (
                  <tr key={site.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-medium text-gray-200">{site.name}</td>
                    <td className="px-6 py-4">{site.location}</td>
                    <td className="px-6 py-4"><StatusChip status={site.status} /></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <SiteProgressBar progress={site.progress} />
                        <span className="text-xs font-medium">{site.progress}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{new Date(site.startDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">{new Date(site.endDate).toLocaleDateString('fr-FR')}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(site)}
                          className="text-sky-400 hover:text-sky-300"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEdit(site)}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(site)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filteredSites.length === 0 && (
          <div className="text-center py-12">
            <HardHat className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Aucun chantier trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chantiers;