import { Sparkles } from "lucide-react";
import LoadingSpinner from "../components/common/LoadingSpinner";
import React from "react";

const RapportsView = ({ onGenerate, report, isLoading }) => (
    <div className="bg-gray-800/50 border border-gray-700/50 p-6 rounded-2xl shadow-lg space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-100">Rapports et Analyses</h3>
            <button 
                onClick={onGenerate} 
                disabled={isLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <Sparkles size={18} /><span>Générer un Rapport de Synthèse</span>
            </button>
        </div>
        <div className="border border-gray-700 rounded-xl p-6 min-h-[300px] bg-gray-900/50">
            <h4 className="text-lg font-semibold text-gray-300 mb-4">Rapport de Synthèse IA</h4>
            {isLoading ? <LoadingSpinner /> : <div className="prose prose-sm prose-invert max-w-none text-gray-300 whitespace-pre-wrap">{report || "Cliquez sur le bouton pour générer un rapport de synthèse sur l'état actuel de tous les chantiers et du matériel."}</div>}
        </div>
    </div>
);

export default RapportsView;