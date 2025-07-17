import React from 'react';
import { 
  Save,
  ArrowLeft,
  Wrench,
  Calendar,
  Truck,
  Info,
  DollarSign,
  ClipboardList,
  Settings,
  AlertTriangle,
  FileText,
  Building2
} from 'lucide-react';

const AddMateriel = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    type: '',
    status: 'Disponible',
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
      site: '',
      specificLocation: ''
    },
    condition: 'Neuf',
    documents: [],
    maintenanceHistory: [],
    notes: ''
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
    // TODO: Add API call to save the equipment
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
          <h2 className="text-2xl font-bold text-white">Nouveau Matériel</h2>
        </div>
      </div>

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
            <SelectField 
              icon={<Wrench />} 
              label="Type" 
              name="type" 
              value={formData.type} 
              onChange={handleChange} 
              options={['Gros œuvre', 'Second œuvre', 'Outillage', 'Véhicule', 'Autre']} 
              required 
            />
            <InputField 
              icon={<FileText />} 
              label="Numéro de série" 
              name="serialNumber" 
              value={formData.serialNumber} 
              onChange={handleChange} 
              placeholder="ex: SN123456789" 
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
              name="manufacturer" 
              value={formData.manufacturer} 
              onChange={handleChange} 
              placeholder="ex: Caterpillar" 
              required 
            />
            <InputField 
              icon={<Settings />} 
              label="Modèle" 
              name="model" 
              value={formData.model} 
              onChange={handleChange} 
              placeholder="ex: CAT-320" 
              required 
            />
            <InputField 
              icon={<Calendar />} 
              label="Date d'achat" 
              name="purchaseDate" 
              type="date" 
              value={formData.purchaseDate} 
              onChange={handleChange} 
              required 
            />
            <InputField 
              icon={<DollarSign />} 
              label="Coût d'achat (€)" 
              name="cost.purchase" 
              type="number" 
              value={formData.cost.purchase} 
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
              name="lastMaintenanceDate" 
              type="date" 
              value={formData.lastMaintenanceDate} 
              onChange={handleChange} 
            />
            <InputField 
              icon={<Calendar />} 
              label="Prochaine maintenance" 
              name="nextMaintenanceDate" 
              type="date" 
              value={formData.nextMaintenanceDate} 
              onChange={handleChange} 
            />
            <InputField 
              icon={<DollarSign />} 
              label="Coût maintenance (€)" 
              name="cost.maintenance" 
              type="number" 
              value={formData.cost.maintenance} 
              onChange={handleChange} 
              placeholder="ex: 1000" 
            />
          </div>
        </div>

        {/* Section: Localisation */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Truck className="mr-3 text-sky-400" />
            Localisation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
            <InputField 
              icon={<Settings />} 
              label="Chantier assigné" 
              name="location.site" 
              value={formData.location.site} 
              onChange={handleChange} 
              placeholder="ex: Chantier Centre-Ville" 
            />
            <InputField 
              icon={<Settings />} 
              label="Emplacement spécifique" 
              name="location.specificLocation" 
              value={formData.location.specificLocation} 
              onChange={handleChange} 
              placeholder="ex: Zone de stockage B" 
            />
          </div>
        </div>

        {/* Section: Notes et Spécifications */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center">
            <Info className="mr-3 text-sky-400" />
            Notes et Spécifications
          </h3>
          <div className="pl-8">
            <TextareaField 
              label="Spécifications techniques" 
              name="specifications" 
              value={formData.specifications} 
              onChange={handleChange} 
              placeholder="Détails techniques, capacités, dimensions..." 
            />
            <div className="mt-4">
              <TextareaField 
                label="Notes additionnelles" 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange} 
                placeholder="Notes importantes, conditions particulières..." 
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700/50">
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-8 py-3 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg text-base font-semibold"
          >
            <Save size={20} />
            <span>Enregistrer le Matériel</span>
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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {React.cloneElement(icon, { size: 18 })}
      </span>
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
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {React.cloneElement(icon, { size: 18 })}
      </span>
      <select
        id={props.name}
        {...props}
        className="w-full appearance-none bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all"
      >
        <option value="">Sélectionner...</option>
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

export default AddMateriel;