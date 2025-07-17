import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    ArrowLeft,
    Calendar,
    AlertTriangle,
    HardHat,
    TrendingUp,
    Package,
    FileText,
    Edit,
    Trash2,
    CheckCircle,
    MessageSquare,
    Send
} from 'lucide-react';

const getReportIcon = (type) => {
    switch (type) {
        case "Rapport Journalier":
            return <Calendar className="text-blue-400" size={24} />;
        case "Rapport d'Incident":
            return <AlertTriangle className="text-red-400" size={24} />;
        case "Rapport de Sécurité":
            return <HardHat className="text-yellow-400" size={24} />;
        case "Rapport d'Avancement":
            return <TrendingUp className="text-green-400" size={24} />;
        case "Rapport de Réception de Matériel":
            return <Package className="text-purple-400" size={24} />;
        default:
            return <FileText className="text-gray-400" size={24} />;
    }
};

const ReportDetails = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        fetchReport();
    }, [id]);

    const fetchReport = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/reports/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReport(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching report:', err);
            setError('Erreur lors de la récupération du rapport');
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/reports/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                navigate('/reports');
            } catch (err) {
                console.error('Error deleting report:', err);
                setError('Erreur lors de la suppression du rapport');
            }
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `http://localhost:5000/api/reports/${id}/comments`,
                { text: newComment },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setReport(response.data);
            setNewComment('');
        } catch (err) {
            console.error('Error adding comment:', err);
            setError('Erreur lors de l\'ajout du commentaire');
        }
    };

    const renderTypeSpecificContent = () => {
        if (!report) return null;

        switch (report.type) {
            case "Rapport Journalier":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Météo</div>
                                <div className="text-lg text-gray-200">{report.content.weather}</div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Température</div>
                                <div className="text-lg text-gray-200">{report.content.temperature}°C</div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Ouvriers présents</div>
                                <div className="text-lg text-gray-200">{report.content.workersPresent}</div>
                            </div>
                        </div>
                        {report.content.tasksCompleted?.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-gray-200 mb-3">Tâches complétées</h4>
                                <div className="space-y-2">
                                    {report.content.tasksCompleted.map((task, index) => (
                                        <div key={index} className="bg-gray-800/30 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">{task.description}</span>
                                                <span className={`text-sm ${
                                                    task.status === 'Completed' ? 'text-green-400' :
                                                    task.status === 'In Progress' ? 'text-yellow-400' :
                                                    'text-red-400'
                                                }`}>
                                                    {task.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "Rapport d'Incident":
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Type d'incident</div>
                                <div className="text-lg text-gray-200">{report.content.incidentType}</div>
                            </div>
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Sévérité</div>
                                <div className={`text-lg ${
                                    report.content.severity === 'Critical' ? 'text-red-400' :
                                    report.content.severity === 'High' ? 'text-orange-400' :
                                    report.content.severity === 'Medium' ? 'text-yellow-400' :
                                    'text-green-400'
                                }`}>
                                    {report.content.severity}
                                </div>
                            </div>
                        </div>
                        {report.content.involvedPersons?.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-medium text-gray-200 mb-3">Personnes impliquées</h4>
                                <div className="space-y-2">
                                    {report.content.involvedPersons.map((person, index) => (
                                        <div key={index} className="bg-gray-800/30 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">{person.name}</span>
                                                <span className="text-sm text-gray-400">{person.role}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case "Rapport de Sécurité":
                return (
                    <div className="space-y-4">
                        {report.content.safetyIssues?.map((issue, index) => (
                            <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-lg text-gray-200 mb-2">{issue.issue}</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                    <div>
                                        <div className="text-sm text-gray-400">Risque</div>
                                        <div className="text-red-400">{issue.risk}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Recommandation</div>
                                        <div className="text-green-400">{issue.recommendation}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case "Rapport d'Avancement":
                return (
                    <div className="space-y-4">
                        <div className="bg-gray-800/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-sm text-gray-400">Progression</div>
                                <div className="text-lg text-gray-200">{report.content.progressPercentage}%</div>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div 
                                    className="bg-sky-600 h-2.5 rounded-full" 
                                    style={{ width: `${report.content.progressPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                        {report.content.milestone && (
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="text-sm text-gray-400">Jalon</div>
                                <div className="text-lg text-gray-200">{report.content.milestone.description}</div>
                                {report.content.milestone.targetDate && (
                                    <div className="text-sm text-gray-400 mt-2">
                                        Date cible: {new Date(report.content.milestone.targetDate).toLocaleDateString('fr-FR')}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            case "Rapport de Réception de Matériel":
                return (
                    <div className="space-y-4">
                        {report.content.materials?.map((material, index) => (
                            <div key={index} className="bg-gray-800/50 p-4 rounded-lg">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">Matériel</div>
                                        <div className="text-lg text-gray-200">
                                            {material.materiel?.name} ({material.materiel?.identifier})
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">Quantité</div>
                                        <div className="text-lg text-gray-200">{material.quantity}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">État</div>
                                        <div className="text-lg text-gray-200">{material.condition}</div>
                                    </div>
                                </div>
                                {material.notes && (
                                    <div className="mt-3 text-gray-400">{material.notes}</div>
                                )}
                            </div>
                        ))}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-sky-400"></div>
            </div>
        );
    }

    if (error || !report) {
        return (
            <div className="text-center py-12">
                <div className="text-red-400 text-xl">{error || 'Rapport non trouvé'}</div>
                <button
                    onClick={() => navigate('/reports')}
                    className="mt-4 text-sky-400 hover:text-sky-300"
                >
                    Retour aux Rapports
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/reports')}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gray-800/50 rounded-lg">
                            {getReportIcon(report.type)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white">{report.type}</h2>
                            <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-gray-400">
                                    {new Date(report.date).toLocaleDateString('fr-FR')}
                                </span>
                                <span className="text-sm text-gray-400">
                                    {report.chantier?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                {(user.role === 'Admin' || report.createdBy?._id === user.id) && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate(`/reports/edit/${report._id}`)}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Description</h3>
                        <p className="text-gray-300 whitespace-pre-wrap">{report.content.description}</p>
                    </div>

                    {/* Type-specific content */}
                    <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Détails</h3>
                        {renderTypeSpecificContent()}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status and metadata */}
                    <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4">Informations</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Statut</span>
                                <span className="flex items-center text-green-400">
                                    <CheckCircle size={16} className="mr-1" />
                                    {report.status}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Créé par</span>
                                <span className="text-gray-200">{report.createdBy?.name}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Date de création</span>
                                <span className="text-gray-200">
                                    {new Date(report.createdAt).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-xl">
                        <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center">
                            <MessageSquare size={18} className="mr-2" />
                            Commentaires
                        </h3>
                        <div className="space-y-4">
                            {report.comments?.map((comment, index) => (
                                <div key={index} className="bg-gray-700/30 p-3 rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <span className="text-gray-300">{comment.text}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-2 text-sm">
                                        <span className="text-gray-400">{comment.user?.name}</span>
                                        <span className="text-gray-500">
                                            {new Date(comment.date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <form onSubmit={handleAddComment} className="mt-4">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Ajouter un commentaire..."
                                        className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="p-2 text-sky-400 hover:text-sky-300 hover:bg-sky-400/10 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        <Send size={20} />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportDetails; 