const LoadingSpinner = () => (
    <div className="flex justify-center items-center space-x-2 p-8">
        <LoaderCircle className="animate-spin text-sky-400" size={24} />
        <span className="text-gray-400">Génération en cours...</span>
    </div>
);

export default LoadingSpinner;