import { X, Menu, ChevronDown, Bell, Search } from 'lucide-react';

const Header = ({ activeView, onToggleSidebar, isSidebarOpen }) => (
    <header className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/60 shadow-lg rounded-2xl p-4 mb-8 flex justify-between items-center">
        <div className="flex items-center">
            <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white mr-4 p-2 rounded-full hover:bg-gray-700">
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1 className="text-2xl font-bold text-gray-100">{activeView}</h1>
        </div>
        <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Rechercher..." className="bg-gray-700 text-gray-200 rounded-lg pl-10 pr-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-sky-500 border border-transparent focus:border-sky-500" />
            </div>
            <button className="relative text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                <Bell size={22} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-gray-800"></span>
            </button>
            <div className="relative hidden md:block">
                 <button className="flex items-center space-x-2">
                    <img className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-600" src="https://placehold.co/100x100/1F2937/9CA3AF?text=MA" alt="User" />
                    <ChevronDown size={16} className="text-gray-500" />
                </button>
            </div>
        </div>
    </header>
);

export default Header;