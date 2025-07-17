import { Sparkles, FileText, Download, Building, Wrench } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import StatusChip from "../components/common/StatusChip";

const RapportsView = () => {
    const [chantiers, setChantiers] = useState([]);
    const [materiel, setMateriel] = useState([]);
    const [loading, setLoading] = useState(true);   
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const [chantiersRes, materielRes] = await Promise.all([
                    axios.get('http://localhost:5000/api/chantiers', { headers }),
                    axios.get('http://localhost:5000/api/materiel', { headers })
                ]);

                setChantiers(chantiersRes.data);
                setMateriel(materielRes.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching data for reports:', err);
                setError('Erreur lors de la récupération des données pour les rapports');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const equipmentStatusData = [
        { name: 'En utilisation', value: materiel.filter(e => e.status === 'En utilisation').length },
        { name: 'Disponible', value: materiel.filter(e => e.status === 'Disponible').length },
        { name: 'En maintenance', value: materiel.filter(e => e.status === 'En maintenance').length },
    ];

    const chantierStatusData = [
        { name: 'En cours', value: chantiers.filter(c => c.status === 'En cours').length },
        { name: 'Terminé', value: chantiers.filter(c => c.status === 'Terminé').length },
        { name: 'Planifié', value: chantiers.filter(c => c.status === 'Planifié').length },
        { name: 'En pause', value: chantiers.filter(c => c.status === 'En pause').length },
    ];

    const COLORS = ['#0ea5e9', '#22c55e', '#ef4444', '#f59e0b'];

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <div className="text-red-400 text-xl text-center py-12">{error}</div>;
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white flex items-center">
                    <FileText className="mr-3 text-sky-400" />
                    Rapports et Statistiques
                </h2>
                <button className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg">
                    <Download size={18} />
                    <span>Générer un PDF</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Statut des Chantiers</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={chantierStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {chantierStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Statut du Matériel</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={equipmentStatusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {equipmentStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <Building className="mr-2 text-sky-400" />
                    Liste des Chantiers
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom</th>
                                <th scope="col" className="px-6 py-3">Statut</th>
                                <th scope="col" className="px-6 py-3">Progression</th>
                                <th scope="col" className="px-6 py-3">Chef Responsable</th>
                                <th scope="col" className="px-6 py-3">Date de début</th>
                                <th scope="col" className="px-6 py-3">Date de fin estimée</th>
                            </tr>
                        </thead>
                        <tbody>
                            {chantiers.map(chantier => (
                                <tr key={chantier._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-gray-200">{chantier.name}</td>
                                    <td className="px-6 py-4"><StatusChip status={chantier.status} /></td>
                                    <td className="px-6 py-4">{chantier.progress}%</td>
                                    <td className="px-6 py-4">{chantier.chefResponsable?.name || 'N/A'}</td>
                                    <td className="px-6 py-4">{new Date(chantier.startDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">{new Date(chantier.estimatedEndDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                    <Wrench className="mr-2 text-sky-400" />
                    Liste du Matériel
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Nom</th>
                                <th scope="col" className="px-6 py-3">Type</th>
                                <th scope="col" className="px-6 py-3">Statut</th>
                                <th scope="col" className="px-6 py-3">Chantier Actuel</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiel.map(mat => (
                                <tr key={mat._id} className="border-b border-gray-700 hover:bg-gray-700/50">
                                    <td className="px-6 py-4 font-medium text-gray-200">{mat.name}</td>
                                    <td className="px-6 py-4">{mat.type}</td>
                                    <td className="px-6 py-4"><StatusChip status={mat.status} /></td>
                                    <td className="px-6 py-4">{mat.location?.currentSite?.name || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default RapportsView;