const initialSites = [
    { id: 1, name: 'Projet Résidentiel "Les Jardins"', location: 'Agadir', startDate: '2024-01-15', endDate: '2025-06-30', status: 'En cours', progress: 65 },
    { id: 2, name: 'Centre Commercial "Océan Plaza"', location: 'Taroudant', startDate: '2023-09-01', endDate: '2024-12-20', status: 'Terminé', progress: 100 },
    { id: 3, name: 'Rénovation Hôtel "Le Littoral"', location: 'Taghazout', startDate: '2024-03-10', endDate: '2025-02-15', status: 'En cours', progress: 40 },
    { id: 4, name: 'Infrastructure Routière N1', location: 'Ouled Berhil', startDate: '2024-05-20', endDate: '2025-08-01', status: 'En attente', progress: 10 },
    { id: 5, name: 'Construction Villa "Mirleft"', location: 'Mirleft', startDate: '2024-02-01', endDate: '2024-11-30', status: 'En cours', progress: 85 },
];

const initialEquipment = [
    { id: 'E001', name: 'Grue à tour', type: 'Levage', status: 'En utilisation', assignedSite: 'Projet Résidentiel "Les Jardins"' },
    { id: 'E002', name: 'Pelleteuse Caterpillar 320', type: 'Terrassement', status: 'Disponible', assignedSite: 'N/A' },
    { id: 'E003', name: 'Bétonnière', type: 'Malaxage', status: 'En maintenance', assignedSite: 'N/A' },
    { id: 'E004', name: 'Camion-benne Volvo', type: 'Transport', status: 'En utilisation', assignedSite: 'Rénovation Hôtel "Le Littoral"' },
    { id: 'E005', name: 'Compacteur', type: 'Finition', status: 'Disponible', assignedSite: 'N/A' },
    { id: 'E006', name: 'Nacelle élévatrice', type: 'Levage', status: 'En utilisation', assignedSite: 'Construction Villa "Mirleft"' },
];

const recentActivities = [
    { id: 1, user: 'Ismail R.', action: 'a mis à jour le statut de', target: 'Projet Résidentiel "Les Jardins"', time: 'il y a 2 heures' },
    { id: 2, user: 'Moad A.', action: 'a assigné', target: 'Grue à tour', time: 'il y a 5 heures' },
    { id: 3, user: 'Système', action: 'a signalé une maintenance pour', target: 'Bétonnière', time: 'il y a 1 jour' },
    { id: 4, user: 'Ismail R.', action: 'a ajouté un nouveau chantier', target: 'Construction Villa "Mirleft"', time: 'il y a 2 jours' },
];
export { initialSites, initialEquipment, recentActivities };