type LoadingOverlayProps = {
    message?: string;
    subMessage?: string;
};

export default function LoadingOverlay({
    message = "Loading...",
    subMessage = "Please wait...",
}: LoadingOverlayProps) {
    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="bg-(--bg-surface) px-6 py-4 rounded-xl shadow-lg flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>

                {/* Main message */}
                <p className="text-xl font-semibold">{message}</p>

                {/* Sub message */}
                {subMessage && (
                    <p className="text-gray-500 text-sm mt-1">{subMessage}</p>
                )}
            </div>
        </div>
    );
}