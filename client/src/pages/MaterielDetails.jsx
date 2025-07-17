import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Wrench,
  MapPin,
  Settings,
  DollarSign,
  FileText, 
  Edit,
  Trash2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import StatusChip from '../components/common/StatusChip';

const MaterielDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [materiel, setMateriel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMateriel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/materiel/${id}`, {
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
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet équipement ?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/materiel/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        navigate('/materiel');
      } catch (err) {
        console.error('Error deleting materiel:', err);
        setError('Erreur lors de la suppression du matériel');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (error || !materiel) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl">{error || 'Matériel non trouvé'}</div>
        <button
          onClick={() => navigate('/materiel')}
          className="mt-4 text-sky-400 hover:text-sky-300"
        >
          Retour au Matériel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/materiel')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-white">{materiel.name}</h2>
            <div className="flex items-center space-x-3 mt-1">
              <span className="text-sm text-gray-400">{materiel.type}</span>
              <span className="text-xs bg-gray-700 px-2 py-1 rounded font-mono text-gray-300">
                {materiel.identifier}
              </span>
              <StatusChip status={materiel.status} />
            </div>
          </div>
        </div>
        {user?.role === 'Admin' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate(`/materiel/edit/${materiel._id}`)}
              className="flex items-center space-x-2 px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg hover:bg-yellow-600/30 transition-colors"
            >
              <Edit size={16} />
              <span>Modifier</span>
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/30 transition-colors"
            >
              <Trash2 size={16} />
              <span>Supprimer</span>
            </button>
          </div>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Wrench className="mr-2 text-sky-400" size={18} />
            Informations de base
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">État</span>
              <span className="text-gray-200">{materiel.condition}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Marque</span>
              <span className="text-gray-200">{materiel.specifications?.brand || 'Non spécifié'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Modèle</span>
              <span className="text-gray-200">{materiel.specifications?.model || 'Non spécifié'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Numéro de série</span>
              <span className="text-gray-200">{materiel.specifications?.serialNumber || 'Non spécifié'}</span>
            </div>
            {materiel.specifications?.capacity && (
              <div className="flex justify-between">
                <span className="text-gray-400">Capacité</span>
                <span className="text-gray-200">{materiel.specifications.capacity}</span>
              </div>
            )}
            {materiel.specifications?.power && (
              <div className="flex justify-between">
                <span className="text-gray-400">Puissance</span>
                <span className="text-gray-200">{materiel.specifications.power}</span>
              </div>
            )}
          </div>
        </div>

        {/* Location Card */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <MapPin className="mr-2 text-sky-400" size={18} />
            Localisation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Site actuel</span>
              <span className="text-gray-200">{materiel.location?.currentSite?.name || 'Non assigné'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Emplacement spécifique</span>
              <span className="text-gray-200">{materiel.location?.specificLocation || 'Non spécifié'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Assigné à</span>
              <span className="text-gray-200">{materiel.location?.assignedTo?.name || 'Non assigné'}</span>
            </div>
          </div>
        </div>

        {/* Maintenance Card */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <Settings className="mr-2 text-sky-400" size={18} />
            Maintenance
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Dernière maintenance</span>
              <span className="text-gray-200">
                {materiel.maintenance?.lastMaintenance ? 
                  new Date(materiel.maintenance.lastMaintenance).toLocaleDateString('fr-FR') : 
                  'Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Prochaine maintenance</span>
              <span className="text-yellow-400">
                {materiel.maintenance?.nextMaintenanceDate ? 
                  new Date(materiel.maintenance.nextMaintenanceDate).toLocaleDateString('fr-FR') : 
                  'Non planifiée'}
              </span>
            </div>
          </div>
          {materiel.maintenance?.maintenanceHistory?.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
              <h4 className="text-sm font-medium text-gray-300 mb-3">Historique des maintenances</h4>
              <div className="space-y-3">
                {materiel.maintenance.maintenanceHistory.map((record, index) => (
                  <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">{record.description}</span>
                      <span className="text-gray-400">{new Date(record.date).toLocaleDateString('fr-FR')}</span>
                    </div>
                    {record.cost && (
                      <div className="text-sm text-gray-400 mt-1">
                        Coût: {record.cost.toLocaleString('fr-FR')} €
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Acquisition Card */}
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <DollarSign className="mr-2 text-sky-400" size={18} />
            Acquisition
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Date d'achat</span>
              <span className="text-gray-200">
                {materiel.acquisition?.purchaseDate ? 
                  new Date(materiel.acquisition.purchaseDate).toLocaleDateString('fr-FR') : 
                  'Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Prix d'achat</span>
              <span className="text-gray-200">
                {materiel.acquisition?.purchasePrice ? 
                  `${materiel.acquisition.purchasePrice.toLocaleString('fr-FR')} €` : 
                  'Non spécifié'}
              </span>
            </div>
            {materiel.acquisition?.supplier?.name && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fournisseur</span>
                  <span className="text-gray-200">{materiel.acquisition.supplier.name}</span>
                </div>
                {materiel.acquisition.supplier.contact && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Contact fournisseur</span>
                    <span className="text-gray-200">{materiel.acquisition.supplier.contact}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notes Section */}
      {materiel.notes && materiel.notes.length > 0 && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center">
            <FileText className="mr-2 text-sky-400" size={18} />
            Notes
          </h3>
          <div className="space-y-3">
            {materiel.notes.map((note, index) => (
              <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                <p className="text-gray-200">{note.text}</p>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                  <span>{note.createdBy?.name}</span>
                  <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MaterielDetails; 