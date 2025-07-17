import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Plus, X } from 'lucide-react';

const CreateReport = ({ user }) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [chantiers, setChantiers] = useState([]);
    const [materiel, setMateriel] = useState([]);
    
    const [formData, setFormData] = useState({
        type: '',
        chantier: '',
        date: new Date().toISOString().split('T')[0],
        content: {
            description: '',
            // Dynamic fields will be added based on type
        }
    });

    useEffect(() => {
        fetchChantiers();
        fetchMateriel();
    }, []);

    const fetchChantiers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/chantiers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setChantiers(response.data);
        } catch (err) {
            console.error('Error fetching chantiers:', err);
            setError('Erreur lors de la récupération des chantiers');
        }
    };

    const fetchMateriel = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/materiel', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMateriel(response.data);
        } catch (err) {
            console.error('Error fetching materiel:', err);
            setError('Erreur lors de la récupération du matériel');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('content.')) {
            const contentField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                content: {
                    ...prev.content,
                    [contentField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/reports', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/reports');
        } catch (err) {
            console.error('Error creating report:', err);
            setError('Erreur lors de la création du rapport');
            setLoading(false);
        }
    };

    // Dynamic form fields based on report type
    const renderTypeSpecificFields = () => {
        switch (formData.type) {
            case "Rapport Journalier":
                return (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Météo
                                </label>
                                <input
                                    type="text"
                                    name="content.weather"
                                    value={formData.content.weather || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Température (°C)
                                </label>
                                <input
                                    type="number"
                                    name="content.temperature"
                                    value={formData.content.temperature || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Nombre d'ouvriers présents
                                </label>
                                <input
                                    type="number"
                                    name="content.workersPresent"
                                    value={formData.content.workersPresent || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                        </div>
                    </>
                );

            case "Rapport d'Incident":
                return (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Type d'incident
                                </label>
                                <input
                                    type="text"
                                    name="content.incidentType"
                                    value={formData.content.incidentType || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Sévérité
                                </label>
                                <select
                                    name="content.severity"
                                    value={formData.content.severity || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                >
                                    <option value="">Sélectionner la sévérité</option>
                                    <option value="Low">Faible</option>
                                    <option value="Medium">Moyenne</option>
                                    <option value="High">Élevée</option>
                                    <option value="Critical">Critique</option>
                                </select>
                            </div>
                        </div>
                    </>
                );

            case "Rapport de Sécurité":
                return (
                    <>
                        <div className="space-y-4">
                            {formData.content.safetyIssues?.map((issue, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">
                                            Problème de sécurité #{index + 1}
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newIssues = [...formData.content.safetyIssues];
                                                newIssues.splice(index, 1);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    content: {
                                                        ...prev.content,
                                                        safetyIssues: newIssues
                                                    }
                                                }));
                                            }}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Description du problème"
                                        value={issue.issue || ''}
                                        onChange={(e) => {
                                            const newIssues = [...formData.content.safetyIssues];
                                            newIssues[index] = { ...newIssues[index], issue: e.target.value };
                                            setFormData(prev => ({
                                                ...prev,
                                                content: {
                                                    ...prev.content,
                                                    safetyIssues: newIssues
                                                }
                                            }));
                                        }}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        content: {
                                            ...prev.content,
                                            safetyIssues: [...(prev.content.safetyIssues || []), { issue: '' }]
                                        }
                                    }));
                                }}
                                className="flex items-center space-x-2 text-sky-400 hover:text-sky-300"
                            >
                                <Plus size={16} />
                                <span>Ajouter un problème</span>
                            </button>
                        </div>
                    </>
                );

            case "Rapport d'Avancement":
                return (
                    <>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Pourcentage d'avancement
                                </label>
                                <input
                                    type="number"
                                    name="content.progressPercentage"
                                    value={formData.content.progressPercentage || ''}
                                    onChange={handleInputChange}
                                    min="0"
                                    max="100"
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description du jalon
                                </label>
                                <input
                                    type="text"
                                    name="content.milestone.description"
                                    value={formData.content.milestone?.description || ''}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                />
                            </div>
                        </div>
                    </>
                );

            case "Rapport de Réception de Matériel":
                return (
                    <>
                        <div className="space-y-4">
                            {formData.content.materials?.map((material, index) => (
                                <div key={index} className="space-y-2 p-4 bg-gray-700/50 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-300">
                                            Matériel #{index + 1}
                                        </label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newMaterials = [...formData.content.materials];
                                                newMaterials.splice(index, 1);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    content: {
                                                        ...prev.content,
                                                        materials: newMaterials
                                                    }
                                                }));
                                            }}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <select
                                        value={material.materiel || ''}
                                        onChange={(e) => {
                                            const newMaterials = [...formData.content.materials];
                                            newMaterials[index] = { ...newMaterials[index], materiel: e.target.value };
                                            setFormData(prev => ({
                                                ...prev,
                                                content: {
                                                    ...prev.content,
                                                    materials: newMaterials
                                                }
                                            }));
                                        }}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        required
                                    >
                                        <option value="">Sélectionner le matériel</option>
                                        {materiel.map(item => (
                                            <option key={item._id} value={item._id}>
                                                {item.name} ({item.identifier})
                                            </option>
                                        ))}
                                    </select>
                                    <input
                                        type="number"
                                        placeholder="Quantité"
                                        value={material.quantity || ''}
                                        onChange={(e) => {
                                            const newMaterials = [...formData.content.materials];
                                            newMaterials[index] = { ...newMaterials[index], quantity: e.target.value };
                                            setFormData(prev => ({
                                                ...prev,
                                                content: {
                                                    ...prev.content,
                                                    materials: newMaterials
                                                }
                                            }));
                                        }}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        required
                                    />
                                    <textarea
                                        placeholder="Notes"
                                        value={material.notes || ''}
                                        onChange={(e) => {
                                            const newMaterials = [...formData.content.materials];
                                            newMaterials[index] = { ...newMaterials[index], notes: e.target.value };
                                            setFormData(prev => ({
                                                ...prev,
                                                content: {
                                                    ...prev.content,
                                                    materials: newMaterials
                                                }
                                            }));
                                        }}
                                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                        rows="2"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData(prev => ({
                                        ...prev,
                                        content: {
                                            ...prev.content,
                                            materials: [...(prev.content.materials || []), { materiel: '', quantity: '', notes: '' }]
                                        }
                                    }));
                                }}
                                className="flex items-center space-x-2 text-sky-400 hover:text-sky-300"
                            >
                                <Plus size={16} />
                                <span>Ajouter un matériel</span>
                            </button>
                        </div>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/reports')}
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-2xl font-bold text-white">Nouveau Rapport</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Type de rapport
                        </label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        >
                            <option value="">Sélectionner le type</option>
                            <option value="Rapport Journalier">Rapport Journalier</option>
                            <option value="Rapport d'Incident">Rapport d'Incident</option>
                            <option value="Rapport de Sécurité">Rapport de Sécurité</option>
                            <option value="Rapport d'Avancement">Rapport d'Avancement</option>
                            <option value="Rapport de Réception de Matériel">Rapport de Réception de Matériel</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Chantier
                        </label>
                        <select
                            name="chantier"
                            value={formData.chantier}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        >
                            <option value="">Sélectionner le chantier</option>
                            {chantiers.map(chantier => (
                                <option key={chantier._id} value={chantier._id}>
                                    {chantier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                            Description
                        </label>
                        <textarea
                            name="content.description"
                            value={formData.content.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            rows="4"
                            required
                        />
                    </div>

                    {formData.type && renderTypeSpecificFields()}
                </div>

                {error && (
                    <div className="text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => navigate('/reports')}
                        className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-6 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all shadow-lg disabled:opacity-50"
                    >
                        {loading ? 'Création...' : 'Créer le rapport'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateReport; 