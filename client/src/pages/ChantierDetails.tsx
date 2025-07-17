import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  HardHat,
  MapPin,
  Calendar,
  Users,
  Building2,
  Phone,
  Mail,
  TrendingUp,
  ArrowLeft,
  Edit,
  Wrench,
  FileText,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
  X
} from 'lucide-react';
import StatusChip from '../components/common/StatusChip';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Equipment {
  item: {
    _id: string;
    name: string;
    type: string;
    status: string;
    identifier?: string; // Added for identifier
  };
  assignedDate: string;
  returnDate: string | null;
}

interface Document {
  _id: string;
  name: string;
  fileUrl: string;
  uploadDate: string;
  type: string;
}

interface Note {
  _id: string;
  text: string;
  createdBy: User;
  createdAt: string;
}

interface Chantier {
  _id: string;
  name: string;
  status: string;
  description: string;
  location: {
    address: string;
    city: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  client: {
    name: string;
    contact: {
      phone: string;
      email: string;
    };
  };
  chefResponsable: User;
  startDate: string;
  estimatedEndDate: string;
  actualEndDate?: string;
  budget: {
    estimated: number;
    actual: number;
  };
  progress: number;
  assignedTeam: Array<{
    user: User;
    role: string;
  }>;
  equipment: Equipment[];
  documents: Document[];
  notes: Note[];
}

interface AssignEquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (materielId: string) => void;
  chantier: Chantier;
}

const AssignEquipmentModal: React.FC<AssignEquipmentModalProps> = ({ isOpen, onClose, onAssign, chantier }) => {
  const [selectedMateriel, setSelectedMateriel] = useState('');
  const [availableMateriel, setAvailableMateriel] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAvailableMateriel = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/materiel', {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Filter out already assigned equipment
        const assignedIds = chantier.equipment.map(eq => eq.item._id);
        const available = response.data.filter(
          mat => mat.status === 'Disponible' && !assignedIds.includes(mat._id)
        );
        setAvailableMateriel(available);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching materiel:', error);
      }
    };

    if (isOpen) {
      fetchAvailableMateriel();
    }
  }, [isOpen, chantier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMateriel) {
      onAssign(selectedMateriel);
      setSelectedMateriel('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-100">Assigner du Matériel</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sélectionner le matériel
            </label>
            <select
              value={selectedMateriel}
              onChange={(e) => setSelectedMateriel(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
              required
            >
              <option value="">Choisir un matériel</option>
              {availableMateriel.map((mat) => (
                <option key={mat._id} value={mat._id}>
                  {mat.name} - {mat.identifier}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700"
              disabled={!selectedMateriel}
            >
              Assigner
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SiteProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-600 rounded-full h-2.5">
    <div 
      className="bg-gradient-to-r from-sky-400 to-sky-600 h-2.5 rounded-full transition-all duration-300" 
      style={{ width: `${progress}%` }}
    ></div>
  </div>
);

const ChantierDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [chantier, setChantier] = useState<Chantier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  useEffect(() => {
    const fetchChantierDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:5000/api/chantiers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChantier(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching chantier details:', err);
        setError('Erreur lors de la récupération des détails du chantier');
        setLoading(false);
      }
    };

    fetchChantierDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  if (error || !chantier) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-xl">{error || 'Chantier non trouvé'}</div>
        <button
          onClick={() => navigate('/chantiers')}
          className="mt-4 text-sky-400 hover:text-sky-300"
        >
          Retour aux chantiers
        </button>
      </div>
    );
  }

  const handleAssignEquipment = async (materielId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/chantiers/${id}/equipment`,
        { materielId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChantier(response.data);
      setIsAssignModalOpen(false);
    } catch (error) {
      console.error('Error assigning equipment:', error);
      setError('Erreur lors de l\'assignation du matériel');
    }
  };

  const handleRemoveEquipment = async (equipmentId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir retirer cet équipement ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:5000/api/chantiers/${id}/equipment/${equipmentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChantier(response.data);
    } catch (error) {
      console.error('Error removing equipment:', error);
      setError('Erreur lors du retrait du matériel');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/chantiers')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">{chantier.name}</h2>
          <StatusChip status={chantier.status} />
        </div>
        <button 
          onClick={() => navigate(`/chantiers/edit/${chantier._id}`)}
          className="flex items-center space-x-2 bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all"
        >
          <Edit size={18} />
          <span>Modifier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <HardHat className="mr-2 text-sky-400" />
              Vue d'ensemble
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Adresse</label>
                  <div className="flex items-start mt-1">
                    <MapPin className="text-gray-400 mr-2 mt-1" size={16} />
                    <div>
                      <p className="text-gray-200">{chantier.location.address}</p>
                      <p className="text-gray-400">{chantier.location.city}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Client</label>
                  <div className="flex items-start mt-1">
                    <Building2 className="text-gray-400 mr-2 mt-1" size={16} />
                    <div>
                      <p className="text-gray-200">{chantier.client.name}</p>
                      <div className="flex items-center text-gray-400 mt-1">
                        <Phone size={14} className="mr-1" />
                        {chantier.client.contact.phone}
                      </div>
                      <div className="flex items-center text-gray-400 mt-1">
                        <Mail size={14} className="mr-1" />
                        {chantier.client.contact.email}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400">Chef Responsable</label>
                  <div className="flex items-start mt-1">
                    <Users className="text-gray-400 mr-2 mt-1" size={16} />
                    <div>
                      <p className="text-gray-200">{chantier.chefResponsable.name}</p>
                      <p className="text-gray-400">{chantier.chefResponsable.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400">Progression</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">{chantier.progress}%</span>
                      <span className="text-gray-400">
                        {chantier.status === 'Terminé' ? 'Complété' : 'En cours'}
                      </span>
                    </div>
                    <SiteProgressBar progress={chantier.progress} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <Calendar className="mr-2 text-sky-400" />
              Calendrier
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Date de début</div>
                <div className="text-lg text-gray-200 mt-1">
                  {new Date(chantier.startDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="text-sm text-gray-400">Date de fin estimée</div>
                <div className="text-lg text-gray-200 mt-1">
                  {new Date(chantier.estimatedEndDate).toLocaleDateString('fr-FR')}
                </div>
              </div>
              {chantier.actualEndDate && (
                <div className="bg-gray-700/30 p-4 rounded-lg">
                  <div className="text-sm text-gray-400">Date de fin réelle</div>
                  <div className="text-lg text-gray-200 mt-1">
                    {new Date(chantier.actualEndDate).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Equipment List */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                <Wrench className="mr-2 text-sky-400" />
                Équipement ({chantier.equipment.length})
              </h3>
              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="flex items-center space-x-2 text-sky-400 hover:text-sky-300"
              >
                <Plus size={20} />
                <span>Assigner du Matériel</span>
              </button>
            </div>
            
            <div className="space-y-3">
              {chantier.equipment.map((eq) => (
                <div key={eq.item._id} className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-600/50 rounded">
                      <Wrench size={16} className="text-sky-400" />
                    </div>
                    <div>
                      <div className="text-gray-200">{eq.item.name}</div>
                      <div className="text-sm text-gray-400">{eq.item.type}</div>
                      <div className="text-xs text-gray-500">{eq.item.identifier}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">
                        Assigné le: {new Date(eq.assignedDate).toLocaleDateString('fr-FR')}
                      </div>
                      {eq.returnDate && (
                        <div className="text-sm text-gray-400">
                          Retourné le: {new Date(eq.returnDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                    {!eq.returnDate && (
                      <button
                        onClick={() => handleRemoveEquipment(eq._id)}
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {chantier.equipment.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  Aucun équipement assigné
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          {/* Budget Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <DollarSign className="mr-2 text-sky-400" />
              Budget
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Budget estimé</label>
                <div className="text-xl font-semibold text-gray-200 mt-1">
                  {chantier.budget.estimated.toLocaleString('fr-FR')} €
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-400">Dépenses actuelles</label>
                <div className="text-xl font-semibold text-gray-200 mt-1">
                  {chantier.budget.actual.toLocaleString('fr-FR')} €
                </div>
              </div>
              <div className="pt-4 border-t border-gray-700">
                <label className="text-sm text-gray-400">Reste</label>
                <div className={`text-xl font-semibold mt-1 ${
                  chantier.budget.estimated - chantier.budget.actual > 0 
                    ? 'text-green-400' 
                    : 'text-red-400'
                }`}>
                  {(chantier.budget.estimated - chantier.budget.actual).toLocaleString('fr-FR')} €
                </div>
              </div>
            </div>
          </div>

          {/* Documents Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <FileText className="mr-2 text-sky-400" />
              Documents ({chantier.documents.length})
            </h3>
            <div className="space-y-3">
              {chantier.documents.map((doc) => (
                <a
                  key={doc._id}
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between bg-gray-700/30 p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <FileText size={16} className="text-sky-400" />
                    <div>
                      <div className="text-gray-200">{doc.name}</div>
                      <div className="text-sm text-gray-400">{doc.type}</div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    {new Date(doc.uploadDate).toLocaleDateString('fr-FR')}
                  </div>
                </a>
              ))}
              {chantier.documents.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  Aucun document
                </div>
              )}
            </div>
          </div>

          {/* Notes Card */}
          <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center">
              <FileText className="mr-2 text-sky-400" />
              Notes ({chantier.notes.length})
            </h3>
            <div className="space-y-3">
              {chantier.notes.map((note) => (
                <div key={note._id} className="bg-gray-700/30 p-3 rounded-lg">
                  <div className="text-gray-200">{note.text}</div>
                  <div className="flex justify-between items-center mt-2 text-sm text-gray-400">
                    <span>{note.createdBy.name}</span>
                    <span>{new Date(note.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
              ))}
              {chantier.notes.length === 0 && (
                <div className="text-center text-gray-400 py-4">
                  Aucune note
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AssignEquipmentModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignEquipment}
        chantier={chantier}
      />
    </div>
  );
};

export default ChantierDetails; 