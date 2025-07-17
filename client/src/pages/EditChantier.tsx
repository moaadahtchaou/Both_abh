import React from 'react';
import { 
  Save,
  Calendar,
  MapPin,
  Users,
  Building2,
  Phone,
  Mail,
  Briefcase,
  ArrowLeft,
  Calculator,
  ClipboardList,
  DollarSign,
  Info,
  Loader2,
  HardHat
} from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface ChantierData {
  name: string;
  location: {
    address: string;
    city: string;
  };
  client: {
    name: string;
    contact: {
      phone: string;
      email: string;
    };
  };
  status: string;
  startDate: string;
  estimatedEndDate: string;
  budget: {
    estimated: string;
  };
  description: string;
  chefResponsable: string;
  progress: number;
}

interface User {
  id: string;
  role: string;
}

interface EditChantierProps {
  user: User;
}

// Function to fetch chefs
const fetchChefs = async () => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get('http://localhost:5000/api/users/chefs', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Function to fetch chantier details
const fetchChantier = async (id: string) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`http://localhost:5000/api/chantiers/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

// Function to update chantier
const updateChantier = async ({ id, data }: { id: string; data: ChantierData }) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`http://localhost:5000/api/chantiers/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

const EditChantier: React.FC<EditChantierProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  // Query to fetch chefs
  const { data: chefs = [], isLoading: chefsLoading } = useQuery({
    queryKey: ['chefs'],
    queryFn: fetchChefs,
    onError: (error) => {
      console.error('Error fetching chefs:', error);
      setError('Erreur lors de la récupération des chefs');
    }
  });

  // Query to fetch chantier details
  const { data: chantier, isLoading: chantierLoading } = useQuery({
    queryKey: ['chantier', id],
    queryFn: () => fetchChantier(id!),
    onError: (error) => {
      console.error('Error fetching chantier:', error);
      setError('Erreur lors de la récupération du chantier');
    }
  });

  // Initialize form data state
  const [formData, setFormData] = React.useState<ChantierData>({
    name: '',
    location: {
      address: '',
      city: '',
    },
    client: {
      name: '',
      contact: {
        phone: '',
        email: ''
      }
    },
    status: '',
    startDate: '',
    estimatedEndDate: '',
    budget: {
      estimated: '',
    },
    description: '',
    chefResponsable: '',
    progress: 0,
  });

  // Update form data when chantier data is loaded
  React.useEffect(() => {
    if (chantier) {
      setFormData({
        name: chantier.name,
        location: chantier.location,
        client: chantier.client,
        status: chantier.status,
        startDate: chantier.startDate.split('T')[0],
        estimatedEndDate: chantier.estimatedEndDate.split('T')[0],
        budget: chantier.budget,
        description: chantier.description || '',
        chefResponsable: chantier.chefResponsable?._id || '',
        progress: chantier.progress,
      });
    }
  }, [chantier]);

  const mutation = useMutation({
    mutationFn: updateChantier,
    onSuccess: () => {
      navigate('/chantiers');
    },
    onError: (error: any) => {
      setError(error.response?.data?.message || 'Une erreur est survenue lors de la mise à jour du chantier');
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for progress to ensure it doesn't exceed 100
    if (name === 'progress') {
      const progressValue = Math.min(Math.max(0, parseInt(value) || 0), 100);
      setFormData(prev => ({
        ...prev,
        progress: progressValue
      }));
      return;
    }
    
    const keys = name.split('.');
    
    if (keys.length > 1) {
      setFormData(prev => {
        const newState = { ...prev };
        let current: any = newState;
        for (let i = 0; i < keys.length - 1; i++) {
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

  // Check if current user is the chef of this chantier
  const isChefOfChantier = chantier?.chefResponsable?._id === user.id;
  const isAdmin = user.role === 'Admin';

  // Function to determine if a field should be disabled
  const isFieldDisabled = (fieldName: string) => {
    if (isAdmin) return false; // Admin can edit everything
    if (!isChefOfChantier) return true; // Not chef, can't edit anything
    
    // Chef can only edit status and progress
    return !['status', 'progress'].includes(fieldName);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate progress value
    if (formData.progress < 0 || formData.progress > 100) {
      setError('La progression doit être comprise entre 0 et 100');
      return;
    }

    // If chef, only send status and progress updates
    const dataToUpdate = isAdmin ? formData : {
      status: formData.status,
      progress: formData.progress
    };

    mutation.mutate({ id: id!, data: dataToUpdate });
  };

  if (chantierLoading || chefsLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  // If not admin and not the chef, show access denied
  if (!isAdmin && !isChefOfChantier) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">Accès refusé</div>
        <p className="text-gray-400 mb-6">Vous n'avez pas les permissions nécessaires pour modifier ce chantier.</p>
        <button
          onClick={() => navigate('/chantiers')}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Retour aux Chantiers
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
            onClick={() => navigate('/chantiers')}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">Modifier le Chantier</h2>
        </div>
        {!isAdmin && (
          <div className="text-sm text-gray-400">
            Mode Chef: Seuls le statut et la progression peuvent être modifiés
          </div>
        )}
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
            <ClipboardList className="mr-3 text-sky-400" />
            Informations de base
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Briefcase />} 
              label="Nom du chantier" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="ex: Projet Résidentiel" 
              required 
              disabled={isFieldDisabled('name')}
            />
            <InputField 
              icon={<MapPin />} 
              label="Ville" 
              name="location.city" 
              value={formData.location.city} 
              onChange={handleChange} 
              placeholder="ex: Agadir" 
              required 
              disabled={isFieldDisabled('location.city')}
            />
            <div className="md:col-span-2">
              <InputField 
                icon={<MapPin />} 
                label="Adresse" 
                name="location.address" 
                value={formData.location.address} 
                onChange={handleChange} 
                placeholder="ex: 123 Rue Principale" 
                required 
                disabled={isFieldDisabled('location.address')}
              />
            </div>
            <SelectField 
              icon={<HardHat />} 
              label="Chef Responsable" 
              name="chefResponsable" 
              value={formData.chefResponsable} 
              onChange={handleChange} 
              options={chefs.map(chef => ({ value: chef._id, label: chef.name }))}
              isLoading={chefsLoading}
              required 
              disabled={isFieldDisabled('chefResponsable')}
            />
            <InputField 
              icon={<Calendar />} 
              label="Date de début" 
              name="startDate" 
              type="date" 
              value={formData.startDate} 
              onChange={handleChange} 
              required 
              disabled={isFieldDisabled('startDate')}
            />
            <InputField 
              icon={<Calendar />} 
              label="Date de fin estimée" 
              name="estimatedEndDate" 
              type="date" 
              value={formData.estimatedEndDate} 
              onChange={handleChange} 
              required 
              disabled={isFieldDisabled('estimatedEndDate')}
            />
            <SelectField 
              icon={<Info />} 
              label="Statut" 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              options={['Planifié', 'En cours', 'Terminé', 'En pause'].map(status => ({ value: status, label: status }))} 
              disabled={isFieldDisabled('status')}
            />
            <InputField 
              icon={<DollarSign />} 
              label="Budget Estimé (€)" 
              name="budget.estimated" 
              type="number" 
              value={formData.budget.estimated} 
              onChange={handleChange} 
              placeholder="ex: 50000" 
              required 
              disabled={isFieldDisabled('budget.estimated')}
            />
            <InputField 
              icon={<Calculator />} 
              label="Progression (%)" 
              name="progress" 
              type="number" 
              value={formData.progress} 
              onChange={handleChange} 
              min="0" 
              max="100" 
              required 
              disabled={isFieldDisabled('progress')}
            />
          </div>
        </div>

        {/* Section: Informations du Client */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Users className="mr-3 text-sky-400" />
            Informations du Client
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Users />} 
              label="Nom du client" 
              name="client.name" 
              value={formData.client.name} 
              onChange={handleChange} 
              placeholder="ex: Jean Dupont" 
              required 
              disabled={isFieldDisabled('client.name')}
            />
            <InputField 
              icon={<Mail />} 
              label="Email du client" 
              name="client.contact.email" 
              type="email" 
              value={formData.client.contact.email} 
              onChange={handleChange} 
              placeholder="ex: client@example.com" 
              required 
              disabled={isFieldDisabled('client.contact.email')}
            />
            <InputField 
              icon={<Phone />} 
              label="Téléphone du client" 
              name="client.contact.phone" 
              type="tel" 
              value={formData.client.contact.phone} 
              onChange={handleChange} 
              placeholder="ex: 06 12 34 56 78" 
              required 
              disabled={isFieldDisabled('client.contact.phone')}
            />
          </div>
        </div>

        {/* Section: Description */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Info className="mr-3 text-sky-400" />
            Description
          </h3>
          <div className="pl-8">
            <TextareaField 
              label="Description du projet" 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              placeholder="Détails sur les travaux à réaliser, les objectifs, etc." 
              disabled={isFieldDisabled('description')}
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
const InputField = ({ icon, label, disabled = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
      <input
        id={props.name}
        {...props}
        disabled={disabled}
        className={`w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      />
    </div>
  </div>
);

const SelectField = ({ icon, label, options, isLoading, disabled = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
      <select
        id={props.name}
        {...props}
        disabled={disabled || isLoading}
        className={`w-full appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <option value="">Sélectionner {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

const TextareaField = ({ label, disabled = false, ...props }) => (
  <div className="space-y-2">
    <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
    <textarea
      id={props.name}
      rows={4}
      {...props}
      disabled={disabled}
      className={`w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    />
  </div>
);

export default EditChantier; 