import { Wrench } from "lucide-react";
import StatusChip from "../components/common/StatusChip";

const Materiel = ({ equipment }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-100">Gestion du Matériel</h3>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2">
              <Wrench size={18} /><span>Ajouter du Matériel</span>
          </button>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                  <tr>
                      <th scope="col" className="px-6 py-3">ID</th><th scope="col" className="px-6 py-3">Nom</th><th scope="col" className="px-6 py-3">Type</th>
                      <th scope="col" className="px-6 py-3">Statut</th><th scope="col" className="px-6 py-3">Chantier Assigné</th><th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {equipment.map(item => (
                      <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="px-6 py-4 font-mono text-gray-300">{item.id}</td>
                          <td className="px-6 py-4 font-medium text-gray-200">{item.name}</td>
                          <td className="px-6 py-4">{item.type}</td>
                          <td className="px-6 py-4"><StatusChip status={item.status} /></td>
                          <td className="px-6 py-4">{item.assignedSite}</td>
                          <td className="px-6 py-4"><a href="#" className="font-medium text-sky-400 hover:underline">Gérer</a></td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  </div>
);

export default Materiel;