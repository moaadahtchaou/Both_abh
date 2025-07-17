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
  Info
} from 'lucide-react';

const AddChantier = () => {
  const [formData, setFormData] = React.useState({
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
    status: 'Planifié',
    startDate: '',
    estimatedEndDate: '',
    budget: {
        estimated: '',
    },
    description: '',
    assignedTeam: [],
    documents: [],
    notes: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split('.');
    
    if (keys.length > 1) {
        setFormData(prev => {
            const newState = { ...prev };
            let current = newState;
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // TODO: Add API call to save the chantier
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => window.history.back()}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold text-white">Nouveau Chantier</h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-8 space-y-10">
        
        {/* Section: Informations de base */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                <ClipboardList className="mr-3 text-sky-400" />
                Informations de base
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
              <InputField icon={<Briefcase />} label="Nom du chantier" name="name" value={formData.name} onChange={handleChange} placeholder="ex: Projet Résidentiel" required />
              <InputField icon={<MapPin />} label="Ville" name="location.city" value={formData.location.city} onChange={handleChange} placeholder="ex: Agadir" required />
              <div className="md:col-span-2">
                <InputField icon={<MapPin />} label="Adresse" name="location.address" value={formData.location.address} onChange={handleChange} placeholder="ex: 123 Rue Principale" required />
              </div>
              <InputField icon={<Calendar />} label="Date de début" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required />
              <InputField icon={<Calendar />} label="Date de fin estimée" name="estimatedEndDate" type="date" value={formData.estimatedEndDate} onChange={handleChange} required />
              <SelectField icon={<Info />} label="Statut" name="status" value={formData.status} onChange={handleChange} options={['Planifié', 'En cours', 'Terminé', 'En pause']} />
              <InputField icon={<DollarSign />} label="Budget Estimé (€)" name="budget.estimated" type="number" value={formData.budget.estimated} onChange={handleChange} placeholder="ex: 50000" required />
            </div>
        </div>

        {/* Section: Informations du Client */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                <Users className="mr-3 text-sky-400" />
                Informations du Client
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
                <InputField icon={<Users />} label="Nom du client" name="client.name" value={formData.client.name} onChange={handleChange} placeholder="ex: Jean Dupont" required />
                <InputField icon={<Building2 />} label="Entreprise (Optionnel)" name="client.company" value={formData.client.company} onChange={handleChange} placeholder="ex: Acme Corp" />
                <InputField icon={<Mail />} label="Email du client" name="client.contact.email" type="email" value={formData.client.contact.email} onChange={handleChange} placeholder="ex: client@example.com" required />
                <InputField icon={<Phone />} label="Téléphone du client" name="client.contact.phone" type="tel" value={formData.client.contact.phone} onChange={handleChange} placeholder="ex: 06 12 34 56 78" required />
            </div>
        </div>

        {/* Section: Description */}
        <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                <Info className="mr-3 text-sky-400" />
                Description
            </h3>
            <div className="pl-8">
              <TextareaField label="Description du projet" name="description" value={formData.description} onChange={handleChange} placeholder="Détails sur les travaux à réaliser, les objectifs, etc." />
            </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700/50">
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg text-base font-semibold"
          >
            <Save size={20} />
            <span>Enregistrer le Chantier</span>
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
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            />
        </div>
    </div>
);

const SelectField = ({ icon, label, options, ...props }) => (
    <div className="space-y-2">
        <label htmlFor={props.name} className="text-sm font-medium text-gray-300">{label}</label>
        <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{React.cloneElement(icon, { size: 18 })}</span>
            <select
                id={props.name}
                {...props}
                className="w-full appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
            >
                {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
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

export default AddChantier;