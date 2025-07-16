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
  Calculator
} from 'lucide-react';

const AddChantier = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    location: '',
    startDate: '',
    endDate: '',
    status: 'En attente',
    budget: '',
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    clientCompany: '',
    description: '',
    teamSize: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
      <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700/50 pb-2">
            Informations de base
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm text-gray-400">
                Nom du chantier
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Entrez le nom du chantier"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="text-sm text-gray-400">
                Localisation
              </label>
              <div className="relative">
                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Adresse du chantier"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm text-gray-400">
                Date de début
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm text-gray-400">
                Date de fin prévue
              </label>
              <div className="relative">
                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm text-gray-400">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="En attente">En attente</option>
                <option value="Planifié">Planifié</option>
                <option value="En cours">En cours</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="budget" className="text-sm text-gray-400">
                Budget (€)
              </label>
              <div className="relative">
                <Calculator size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="budget"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Budget estimé"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700/50 pb-2">
            Informations du client
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="clientName" className="text-sm text-gray-400">
                Nom du client
              </label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Nom complet"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="clientCompany" className="text-sm text-gray-400">
                Entreprise
              </label>
              <div className="relative">
                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  id="clientCompany"
                  name="clientCompany"
                  value={formData.clientCompany}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Nom de l'entreprise"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="clientEmail" className="text-sm text-gray-400">
                Email
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Email du client"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="clientPhone" className="text-sm text-gray-400">
                Téléphone
              </label>
              <div className="relative">
                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Numéro de téléphone"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-200 border-b border-gray-700/50 pb-2">
            Informations supplémentaires
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="description" className="text-sm text-gray-400">
                Description du projet
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                placeholder="Description détaillée du projet..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="teamSize" className="text-sm text-gray-400">
                Taille de l'équipe
              </label>
              <div className="relative">
                <Users size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  id="teamSize"
                  name="teamSize"
                  value={formData.teamSize}
                  onChange={handleChange}
                  className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  placeholder="Nombre de personnes"
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-gray-700/50">
          <button
            type="submit"
            className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-2.5 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg"
          >
            <Save size={20} />
            <span>Enregistrer le chantier</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddChantier; 