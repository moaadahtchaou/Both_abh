const StatusChip = ({ status }) => {
    const getStatusStyles = () => {
        switch (status) {
            case 'En cours':
            case 'En utilisation':
                return "text-blue-400 bg-blue-900/50";
            case 'Terminé':
            case 'Disponible':
                return "text-green-400 bg-green-900/50";
            case 'En attente':
                return "text-yellow-400 bg-yellow-900/50";
            case 'En maintenance':
                return "text-red-400 bg-red-900/50";
            default:
                return "text-gray-400 bg-gray-700";
        }
    };
    return <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusStyles()}`}>{status}</span>;
};

export default StatusChip;