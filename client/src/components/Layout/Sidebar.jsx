import { HardHat } from 'lucide-react';
import { LayoutDashboard, Building, Wrench, FileText, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo2-Photoroom.png';
const Sidebar = ({ activeView, isSidebarOpen }) => {
    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
        { name: 'Chantiers', icon: Building, path: '/chantiers' },
        { name: 'Matériel', icon: Wrench, path: '/materiel' },
        { name: 'Rapports', icon: FileText, path: '/rapports' },
    ];

    return (
        <aside className={`bg-gray-900 text-gray-200 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col transition-all duration-300 ease-in-out shadow-2xl`}>
            <div className="flex items-center justify-center h-20 border-b border-gray-700/50">
                 <img src={logo} alt="Abhaje Frères Logo" className={`h-12 w-auto transition-all duration-300 ${isSidebarOpen ? '' : 'h-10'}`} />
            </div>
            <nav className="flex-1 px-4 py-6 space-y-2">
                {menuItems.map(item => (
                    <Link
                        key={item.name}
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors ${activeView === item.name ? 'bg-sky-600 text-white shadow-md' : 'hover:bg-gray-800 text-gray-400'} ${!isSidebarOpen && 'justify-center'}`}
                    >
                        <item.icon size={20} />
                        {isSidebarOpen && <span className="ml-4 font-medium">{item.name}</span>}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-gray-700/50">
                <div className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
                    <img className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-600" src="https://placehold.co/100x100/1F2937/9CA3AF?text=MA" alt="User" />
                    {isSidebarOpen && (
                        <div className="ml-3">
                            <p className="text-sm font-semibold text-gray-200">Moad Ahtchaou</p>
                            <p className="text-xs text-gray-500">Admin</p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;