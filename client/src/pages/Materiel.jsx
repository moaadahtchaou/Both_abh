import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Wrench, 
    Search, 
    Filter, 
    Plus, 
    Eye, 
    Edit, 
    Trash2, 
    Settings,
    Truck,
    Hammer,
    Zap,
    AlertTriangle,
    CheckCircle,
    Clock,
    BarChart3
} from "lucide-react";
import StatusChip from "../components/common/StatusChip";
import { useState, useEffect } from 'react';
import axios from 'axios';

const SiteProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-600 rounded-full h-2.5">
    <div 
      className="bg-gradient-to-r from-sky-400 to-sky-600 h-2.5 rounded-full transition-all duration-300" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const getEquipmentIcon = (type) => {
  switch (type.toLowerCase()) {
    case 'levage':
      return <Zap className="text-yellow-400" size={20} />;
    case 'terrassement':
      return <Hammer className="text-orange-400" size={20} />;
    case 'transport':
      return <Truck className="text-blue-400" size={20} />;
    case 'malaxage':
      return <Settings className="text-green-400" size={20} />;
    case 'finition':
      return <Wrench className="text-purple-400" size={20} />;
    default:
      return <Wrench className="text-gray-400" size={20} />;
  }
};

const EquipmentCard = ({ equipment, onViewDetails, onEdit, onDelete, onAssign }) => (
  <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-gray-700/50 rounded-lg">
          {getEquipmentIcon(equipment.type)}
        </div>
        <div>
          <h4 className="font-semibold text-gray-100 text-lg">{equipment.name}</h4>
          <div className="flex items-center text-sm text-gray-400 mt-1">
            <span className="font-mono text-xs bg-gray-700/50 px-2 py-1 rounded">
              {equipment.identifier}
            </span>
            <span className="ml-2">{equipment.type}</span>
          </div>
        </div>
      </div>
      <StatusChip status={equipment.status} />
    </div>
    
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Site actuel</span>
        <span className="text-gray-300 font-medium text-right">
          {equipment.location?.currentSite?.name || 'Non assigné'}
        </span>
      </div>
      
      {equipment.maintenance?.nextMaintenanceDate && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Prochaine maintenance</span>
          <span className="text-yellow-400 font-medium">
            {new Date(equipment.maintenance.nextMaintenanceDate).toLocaleDateString('fr-FR')}
          </span>
        </div>
      )}
    </div>
    
    <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
      <button 
        onClick={() => onViewDetails(equipment)}
        className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors"
      >
        <Eye size={16} />
        <span className="text-sm">Détails</span>
      </button>
      <div className="flex space-x-2">
        {equipment.status === 'Disponible' && (
          <button 
            onClick={() => onAssign(equipment)}
            className="p-2 text-gray-400 hover:text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
            title="Assigner"
          >
            <CheckCircle size={16} />
          </button>
        )}
        <button 
          onClick={() => onEdit(equipment)}
          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
          title="Modifier"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(equipment)}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
          title="Supprimer"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  </div>
);

const Materiel = ({ user }) => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [materiel, setMateriel] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/materiel', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMateriel(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching materiel:', err);
        setError('Erreur lors de la récupération du matériel');
        setLoading(false);
      }
    };

    fetchMateriel();
  }, []);

  // Get unique types for filter from actual data
  const equipmentTypes = [...new Set(materiel.map(item => item.type))];

  // Filter and sort equipment
  const filteredEquipment = materiel
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.identifier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.type.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return a.type.localeCompare(b.type);
        case 'status':
          return a.status.localeCompare(b.status);
        case 'identifier':
          return a.identifier.localeCompare(b.identifier);
        default:
          return 0;
      }
    });

  const handleViewDetails = (equipment) => {
    navigate(`/materiel/${equipment._id}`);
  };

  const handleEdit = (equipment) => {
    navigate(`/materiel/edit/${equipment._id}`);
  };

  const handleDelete = async (equipment) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/materiel/${equipment._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMateriel(materiel.filter(m => m._id !== equipment._id));
      } catch (err) {
        console.error('Error deleting equipment:', err);
        alert('Erreur lors de la suppression de l\'équipement');
      }
    }
  };

  const handleAssign = (equipment) => {
    console.log('Assign equipment:', equipment);
  };

  const getStatusCounts = () => {
    return {
      total: materiel.length,
      available: materiel.filter(e => e.status === 'Disponible').length,
      inUse: materiel.filter(e => e.status === 'En utilisation').length,
      maintenance: materiel.filter(e => e.status === 'En maintenance').length,
    };
  };

  const statusCounts = getStatusCounts();

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
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-900/50 rounded-lg">
              <Wrench className="text-blue-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Matériel</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-900/50 rounded-lg">
              <CheckCircle className="text-green-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Disponible</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.available}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-900/50 rounded-lg">
              <BarChart3 className="text-orange-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">En utilisation</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.inUse}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700/50 p-4 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-900/50 rounded-lg">
              <AlertTriangle className="text-red-400" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-400">En maintenance</p>
              <p className="text-2xl font-bold text-gray-100">{statusCounts.maintenance}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <h3 className="text-xl font-semibold text-gray-100">Gestion du Matériel</h3>
          {user?.role === 'Admin' && (
            <button 
              onClick={() => navigate('/materiel/add')}
              className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg"
            >
              <Plus size={18} />
              <span>Nouveau Matériel</span>
            </button>
          )}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher du matériel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tous les statuts</option>
              <option value="Disponible">Disponible</option>
              <option value="En utilisation">En utilisation</option>
              <option value="En maintenance">En maintenance</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="all">Tous les types</option>
              {equipmentTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="name">Nom</option>
              <option value="type">Type</option>
              <option value="status">Statut</option>
              <option value="identifier">ID</option>
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
            {filteredEquipment.map(item => (
              <EquipmentCard 
                key={item._id} 
                equipment={item} 
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAssign={handleAssign}
              />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                <tr>
                  <th scope="col" className="px-6 py-3">ID</th>
                  <th scope="col" className="px-6 py-3">Nom</th>
                  <th scope="col" className="px-6 py-3">Type</th>
                  <th scope="col" className="px-6 py-3">Statut</th>
                  <th scope="col" className="px-6 py-3">Chantier Assigné</th>
                  <th scope="col" className="px-6 py-3">Prochaine Maintenance</th>
                  <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map(item => (
                  <tr key={item._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.identifier}</td>
                    <td className="px-6 py-4 font-medium text-gray-200">
                      <div className="flex items-center space-x-2">
                        {getEquipmentIcon(item.type)}
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4"><StatusChip status={item.status} /></td>
                    <td className="px-6 py-4">{item.location?.currentSite?.name || 'Non assigné'}</td>
                    <td className="px-6 py-4">
                      {item.maintenance?.nextMaintenanceDate ? (
                        <span className="text-yellow-400">
                          {new Date(item.maintenance.nextMaintenanceDate).toLocaleDateString('fr-FR')}
                        </span>
                      ) : (
                        <span className="text-gray-500">Non planifiée</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewDetails(item)}
                          className="text-sky-400 hover:text-sky-300"
                          title="Voir les détails"
                        >
                          <Eye size={16} />
                        </button>
                        {item.status === 'Disponible' && (
                          <button 
                            onClick={() => handleAssign(item)}
                            className="text-green-400 hover:text-green-300"
                            title="Assigner"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-yellow-400 hover:text-yellow-300"
                          title="Modifier"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item)}
                          className="text-red-400 hover:text-red-300"
                          title="Supprimer"
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

        {filteredEquipment.length === 0 && (
          <div className="text-center py-12">
            <Wrench className="mx-auto text-gray-500 mb-4" size={48} />
            <p className="text-gray-400">Aucun équipement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Materiel;
  