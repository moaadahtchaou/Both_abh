import { X, Menu, ChevronDown, Bell, Search, LogOut, User, Settings } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = ({ activeView, onToggleSidebar, isSidebarOpen, user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate();

    // Function to get user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase();
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="bg-gray-800/80 backdrop-blur-sm border border-gray-700/60 shadow-lg rounded-2xl p-4 mb-8 flex justify-between items-center">
            <div className="flex items-center">
                <button onClick={onToggleSidebar} className="text-gray-400 hover:text-white mr-4 p-2 rounded-full hover:bg-gray-700">
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
                <h1 className="text-2xl font-bold text-gray-100">{activeView}</h1>
            </div>
            <div className="flex items-center space-x-6">

                <button className="relative text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700">
                    <Bell size={22} />
                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full ring-2 ring-gray-800"></span>
                </button>
                <div className="relative hidden md:block">
                    <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center space-x-2 focus:outline-none"
                    >
                        <div className="h-10 w-10 rounded-full ring-2 ring-gray-600 flex items-center justify-center bg-gray-800 text-white font-semibold">
                            {getUserInitials(user?.name)}
                        </div>
                        <ChevronDown size={16} className={`text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-gray-800 border border-gray-700 shadow-lg py-1 z-50">
                            <div className="px-4 py-2 border-b border-gray-700">
                                <p className="text-sm font-semibold text-white">{user?.name}</p>
                                <p className="text-xs text-gray-400">{user?.email}</p>
                            </div>
                            <div className="border-t border-gray-700">
                                <button 
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center space-x-2"
                                >
                                    <LogOut size={16} />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;