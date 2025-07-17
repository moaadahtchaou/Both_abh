import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    FileText, 
    Plus, 
    Search, 
    Filter,
    AlertTriangle,
    CheckCircle,
    HardHat,
    TrendingUp,
    Package,
    Calendar,
    Eye,
    Edit,
    Trash2
} from 'lucide-react';

const getReportIcon = (type) => {
    switch (type) {
        case "Rapport Journalier":
            return <Calendar className="text-blue-400" size={20} />;
        case "Rapport d'Incident":
            return <AlertTriangle className="text-red-400" size={20} />;
        case "Rapport de Sécurité":
            return <HardHat className="text-yellow-400" size={20} />;
        case "Rapport d'Avancement":
            return <TrendingUp className="text-green-400" size={20} />;
        case "Rapport de Réception de Matériel":
            return <Package className="text-purple-400" size={20} />;
        default:
            return <FileText className="text-gray-400" size={20} />;
    }
};

const ReportCard = ({ report, onView, onEdit, onDelete }) => (
    <div className="bg-gray-800/60 border border-gray-700/50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600/50">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
                <div className="p-2 bg-gray-700/50 rounded-lg">
                    {getReportIcon(report.type)}
                </div>
                <div>
                    <h4 className="font-semibold text-gray-100">{report.type}</h4>
                    <div className="text-sm text-gray-400 mt-1">
                        {new Date(report.date).toLocaleDateString('fr-FR')}
                    </div>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                {report.status === 'Approved' && (
                    <span className="flex items-center text-green-400 text-sm">
                        <CheckCircle size={16} className="mr-1" />
                        Approuvé
                    </span>
                )}
            </div>
        </div>

        <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Chantier</span>
                <span className="text-gray-300">{report.chantier?.name}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Créé par</span>
                <span className="text-gray-300">{report.createdBy?.name}</span>
            </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
            <button
                onClick={() => onView(report)}
                className="flex items-center space-x-2 text-sky-400 hover:text-sky-300 transition-colors"
            >
                <Eye size={16} />
                <span className="text-sm">Voir</span>
            </button>
            <div className="flex space-x-2">
                <button
                    onClick={() => onEdit(report)}
                    className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                    title="Modifier"
                >
                    <Edit size={16} />
                </button>
                <button
                    onClick={() => onDelete(report)}
                    className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Supprimer"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    </div>
);

const Reports = ({ user }) => {
    const navigate = useNavigate();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/reports', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReports(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching reports:', err);
            setError('Erreur lors de la récupération des rapports');
            setLoading(false);
        }
    };

    const handleDelete = async (report) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/reports/${report._id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setReports(reports.filter(r => r._id !== report._id));
            } catch (err) {
                console.error('Error deleting report:', err);
                alert('Erreur lors de la suppression du rapport');
            }
        }
    };

    const filteredReports = reports.filter(report => {
        const matchesSearch = 
            report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.chantier?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.createdBy?.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = typeFilter === 'all' || report.type === typeFilter;
        
        let matchesDate = true;
        if (dateFilter !== 'all') {
            const reportDate = new Date(report.date);
            const today = new Date();
            switch (dateFilter) {
                case 'today':
                    matchesDate = reportDate.toDateString() === today.toDateString();
                    break;
                case 'week':
                    const weekAgo = new Date(today.setDate(today.getDate() - 7));
                    matchesDate = reportDate >= weekAgo;
                    break;
                case 'month':
                    const monthAgo = new Date(today.setMonth(today.getMonth() - 1));
                    matchesDate = reportDate >= monthAgo;
                    break;
            }
        }

        return matchesSearch && matchesType && matchesDate;
    });

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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                <h2 className="text-2xl font-bold text-white">Rapports</h2>
                <button
                    onClick={() => navigate('/reports/new')}
                    className="bg-gradient-to-r from-sky-600 to-sky-700 text-white px-4 py-2 rounded-lg hover:from-sky-700 hover:to-sky-800 transition-all flex items-center space-x-2 shadow-lg"
                >
                    <Plus size={18} />
                    <span>Nouveau Rapport</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher des rapports..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        />
                    </div>
                    
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="all">Tous les types</option>
                        <option value="Rapport Journalier">Rapport Journalier</option>
                        <option value="Rapport d'Incident">Rapport d'Incident</option>
                        <option value="Rapport de Sécurité">Rapport de Sécurité</option>
                        <option value="Rapport d'Avancement">Rapport d'Avancement</option>
                        <option value="Rapport de Réception de Matériel">Rapport de Réception de Matériel</option>
                    </select>

                    <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    >
                        <option value="all">Toutes les dates</option>
                        <option value="today">Aujourd'hui</option>
                        <option value="week">Cette semaine</option>
                        <option value="month">Ce mois</option>
                    </select>
                </div>
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map(report => (
                    <ReportCard
                        key={report._id}
                        report={report}
                        onView={(report) => navigate(`/reports/${report._id}`)}
                        onEdit={(report) => navigate(`/reports/edit/${report._id}`)}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            {filteredReports.length === 0 && (
                <div className="text-center py-12">
                    <FileText className="mx-auto text-gray-500 mb-4" size={48} />
                    <p className="text-gray-400">Aucun rapport trouvé</p>
                </div>
            )}
        </div>
    );
};

export default Reports; 