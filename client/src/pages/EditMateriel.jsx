import React from 'react';
import { 
  Save,
  ArrowLeft,
  Wrench,
  Calendar,
  Info,
  DollarSign,
  ClipboardList,
  Settings,
  AlertTriangle,
  FileText,
  Building2,
  Loader2,
  MapPin
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

// Function to fetch materiel details
const fetchMateriel = async (id) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`http://localhost:5000/api/materiel/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Function to fetch chantiers
const fetchChantiers = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get('http://localhost:5000/api/chantiers', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Function to update materiel
const updateMateriel = async ({ id, data }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`http://localhost:5000/api/materiel/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const EditMateriel = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  // Query to fetch materiel details
  const { data: materiel, isLoading: materielLoading } = useQuery({
    queryKey: ['materiel', id],
    queryFn: () => fetchMateriel(id),
    onError: (error) => {
      console.error('Error fetching materiel:', error);
      setError('Erreur lors de la récupération du matériel');
    }
  });

  // Query to fetch chantiers
  const { data: chantiers = [], isLoading: chantiersLoading } = useQuery({
    queryKey: ['chantiers'],
    queryFn: fetchChantiers,
    onError: (error) => {
      console.error('Error fetching chantiers:', error);
      setError('Erreur lors de la récupération des chantiers');
    }
  });

  const mutation = useMutation({
    mutationFn: updateMateriel,
    onSuccess: () => {
      navigate('/materiel');
    },
    onError: (error) => {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du matériel');
    }
  });

  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    status: 'Disponible',
    identifier: '',
    serialNumber: '',
    manufacturer: '',
    model: '',
    purchaseDate: '',
    lastMaintenanceDate: '',
    nextMaintenanceDate: '',
    cost: {
      purchase: '',
      maintenance: ''
    },
    specifications: '',
    location: {
      currentSite: '',
      specificLocation: ''
    },
    condition: 'Neuf',
    documents: [],
    maintenanceHistory: [],
    notes: [],
    noteText: ''
  });

  // Update form data when materiel data is loaded
  React.useEffect(() => {
    if (materiel) {
      setFormData({
        ...materiel,
        noteText: materiel.notes?.[0]?.text || '',
        specifications: {
          brand: materiel.specifications?.brand || '',
          model: materiel.specifications?.model || '',
          serialNumber: materiel.specifications?.serialNumber || '',
          year: materiel.specifications?.year || '',
          capacity: materiel.specifications?.capacity || '',
          power: materiel.specifications?.power || ''
        },
        acquisition: {
          purchaseDate: materiel.acquisition?.purchaseDate?.split('T')[0] || '',
          purchasePrice: materiel.acquisition?.purchasePrice || '',
          supplier: materiel.acquisition?.supplier || { name: '', contact: '' }
        },
        maintenance: {
          lastMaintenance: materiel.maintenance?.lastMaintenance?.split('T')[0] || '',
          nextMaintenanceDate: materiel.maintenance?.nextMaintenanceDate?.split('T')[0] || '',
          maintenanceHistory: materiel.maintenance?.maintenanceHistory || []
        },
        location: {
          currentSite: materiel.location?.currentSite?._id || '',
          specificLocation: materiel.location?.specificLocation || '',
          assignedTo: materiel.location?.assignedTo || null
        }
      });
    }
  }, [materiel]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for note text input
    if (name === 'noteText') {
      setFormData(prev => ({
        ...prev,
        noteText: value
      }));
      return;
    }

    // Special handling for chantier selection
    if (name === 'location.currentSite') {
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          currentSite: value || null,  // Convert empty string to null
          specificLocation: value ? prev.location.specificLocation : ''  // Clear specific location if no site
        },
        status: value ? 'En utilisation' : 'Disponible'  // Update status based on site selection
      }));
      return;
    }
    
    const keys = name.split('.');
    
    if (keys.length > 1) {
      setFormData(prev => {
        const newState = { ...prev };
        let current = newState;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newState;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const dataToSubmit = {
      ...formData,
      location: {
        ...formData.location,
        currentSite: formData.location.currentSite || null,  // Ensure null for empty site
        specificLocation: formData.location.specificLocation || ''
      }
    };

    // Add note if there's text
    if (formData.noteText.trim()) {
      dataToSubmit.notes = [{
        text: formData.noteText.trim(),
        createdAt: new Date()
      }];
    }

    // Remove temporary fields
    delete dataToSubmit.noteText;
    delete dataToSubmit._id;
    delete dataToSubmit.__v;
    delete dataToSubmit.createdAt;
    delete dataToSubmit.updatedAt;

    console.log('Submitting data:', dataToSubmit);  // Debug log
    mutation.mutate({ id, data: dataToSubmit });
  };

  if (materielLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  // Check if user has permission to edit
  if (user.role !== 'Admin') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">Accès refusé</div>
        <p className="text-gray-400 mb-6">Vous n'avez pas les permissions nécessaires pour modifier ce matériel.</p>
        <button
          onClick={() => navigate('/materiel')}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
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
          <h2 className="text-2xl font-bold text-white">Modifier le Matériel</h2>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 space-y-10">
        
        {/* Section: Informations de base */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Wrench className="mr-3 text-sky-400" />
            Informations de base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Settings />} 
              label="Nom du matériel" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="ex: Grue de chantier" 
              required 
            />
            <InputField 
              icon={<FileText />} 
              label="Identifiant unique" 
              name="identifier" 
              value={formData.identifier} 
              onChange={handleChange} 
              disabled
            />
            <SelectField 
              icon={<Wrench />} 
              label="Type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              options={['Véhicule', 'Outil électrique', 'Outil manuel', 'Machine lourde', 'Échafaudage', 'Équipement de sécurité', 'Autre']} 
              required 
            />
            <SelectField 
              icon={<AlertTriangle />} 
              label="État" 
              name="condition" 
              value={formData.condition} 
              onChange={handleChange} 
              options={['Neuf', 'Bon état', 'Usage normal', 'Nécessite maintenance', 'Hors service']} 
            />
            <SelectField 
              icon={<AlertTriangle />} 
              label="Statut" 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              options={['Disponible', 'En utilisation', 'En maintenance', 'Hors service']} 
              disabled={formData.location.currentSite !== ''} 
              required 
            />
          </div>
        </div>

        {/* Section: Détails techniques */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <ClipboardList className="mr-3 text-sky-400" />
            Détails techniques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Building2 />} 
              label="Fabricant" 
              name="specifications.brand" 
              value={formData.specifications?.brand || ''} 
              onChange={handleChange} 
              placeholder="ex: Caterpillar" 
              required 
            />
            <InputField 
              icon={<Settings />} 
              label="Modèle" 
              name="specifications.model" 
              value={formData.specifications?.model || ''} 
              onChange={handleChange} 
              placeholder="ex: CAT-320" 
              required 
            />
            <InputField 
              icon={<Calendar />} 
              label="Date d'achat" 
              name="acquisition.purchaseDate" 
              type="date" 
              value={formData.acquisition?.purchaseDate || ''} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              icon={<DollarSign />} 
              label="Coût d'achat (€)" 
              name="acquisition.purchasePrice" 
              type="number" 
              value={formData.acquisition?.purchasePrice || ''} 
              onChange={handleChange} 
              placeholder="ex: 50000" 
              required 
            />
          </div>
        </div>

        {/* Section: Maintenance */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Wrench className="mr-3 text-sky-400" />
            Maintenance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Calendar />} 
              label="Dernière maintenance" 
              name="maintenance.lastMaintenance" 
              type="date" 
              value={formData.maintenance?.lastMaintenance || ''} 
              onChange={handleChange} 
            />
            <InputField 
              icon={<Calendar />} 
              label="Prochaine maintenance" 
              name="maintenance.nextMaintenanceDate" 
              type="date" 
              value={formData.maintenance?.nextMaintenanceDate || ''} 
              onChange={handleChange} 
            />
          </div>
        </div>

        {/* Section: Localisation */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <MapPin className="mr-3 text-sky-400" />
            Localisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <SelectField 
              icon={<Building2 />} 
              label="Chantier (optionnel)" 
              name="location.currentSite" 
              value={formData.location?.currentSite || ''} 
              onChange={handleChange} 
              options={[
                { value: '', label: 'Aucun chantier' },
                ...chantiers.map(chantier => ({ 
                  value: chantier._id, 
                  label: chantier.name 
                }))
              ]}
              isLoading={chantiersLoading}
            />
            <InputField 
              icon={<MapPin />} 
              label="Emplacement spécifique" 
              name="location.specificLocation" 
              value={formData.location?.specificLocation || ''} 
              onChange={handleChange} 
              placeholder="ex: Zone de stockage nord" 
            />
          </div>
        </div>

        {/* Section: Notes */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Info className="mr-3 text-sky-400" />
            Notes
          </h3>
          <div className="pl-8">
            <TextareaField 
              label="Notes additionnelles" 
              name="noteText" 
              value={formData.noteText} 
              onChange={handleChange} 
              placeholder="Informations supplémentaires sur le matériel..." 
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700/50">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {mutation.isPending ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Mise à jour en cours...</span>
              </>
            ) : (
              <>
                <Save size={20} />
                <span>Enregistrer les Modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Reusable Components for Form Fields
const InputField = ({ icon, label, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
      <input
        id={props.name}
        {...props}
        className={`w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          props.disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
    </div>
  </div>
);

const SelectField = ({ icon, label, options, isLoading, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
      <select
        id={props.name}
        {...props}
        disabled={isLoading || props.disabled}
        className={`w-full appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          (isLoading || props.disabled) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">Sélectionner {label}</option>
        {Array.isArray(options) ? 
          options.map((opt, index) => (
            <option key={index} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))
          : null
        }
      </select>
    </div>
  </div>
);

const TextareaField = ({ label, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <textarea
      id={props.name}
      rows={4}
      {...props}
      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
    />
  </div>
);

export default EditMateriel; 