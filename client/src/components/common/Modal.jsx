const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-700">
                    <h3 className="text-xl font-semibold text-gray-100 flex items-center">
                        <Sparkles className="text-purple-400 mr-2" size={24} />
                        {title}
                    </h3>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700">
                        <X size={24} className="text-gray-500 hover:text-gray-300" />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;