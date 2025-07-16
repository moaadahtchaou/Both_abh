import { HardHat } from "lucide-react";
import StatusChip from "../components/common/StatusChip";
import { Sparkles } from "lucide-react";
import React from "react";

const SiteProgressBar = ({ progress }) => (
  <div className="w-full bg-gray-600 rounded-full h-2.5">
      <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
  </div>
);

const Chantiers = ({ sites, onAnalyze }) => (
  <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-gray-100">Gestion des Chantiers</h3>
          <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors flex items-center space-x-2">
              <HardHat size={18} /><span>Ajouter un Chantier</span>
          </button>
      </div>
      <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-400 uppercase bg-gray-700/50">
                  <tr>
                      <th scope="col" className="px-6 py-3">Nom du Chantier</th><th scope="col" className="px-6 py-3">Localisation</th>
                      <th scope="col" className="px-6 py-3">Statut</th><th scope="col" className="px-6 py-3">Progression</th>
                      <th scope="col" className="px-6 py-3 text-center">Analyse IA</th><th scope="col" className="px-6 py-3">Actions</th>
                  </tr>
              </thead>
              <tbody>
                  {sites.map(site => (
                      <tr key={site.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                          <td className="px-6 py-4 font-medium text-gray-200">{site.name}</td>
                          <td className="px-6 py-4">{site.location}</td>
                          <td className="px-6 py-4"><StatusChip status={site.status} /></td>
                          <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                  <SiteProgressBar progress={site.progress} />
                                  <span className="text-xs font-medium">{site.progress}%</span>
                              </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                              <button onClick={() => onAnalyze(site)} className="bg-purple-900/60 text-purple-300 px-3 py-1 rounded-full hover:bg-purple-800/60 transition-colors flex items-center space-x-1 text-xs font-semibold">
                                  <Sparkles size={14} /><span>Analyser</span>
                              </button>
                          </td>
                          <td className="px-6 py-4"><a href="#" className="font-medium text-sky-400 hover:underline">Détails</a></td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  </div>
);

export default Chantiers;