type LoadingStateProps = {
    message?: string;
    subMessage?: string;
};

export default function LoadingState({
    message = "Loading...",
    subMessage = "Please wait...",
}: LoadingStateProps) {
    return (
        <div className="w-full flex flex-col items-center justify-center py-12 text-center">
            {/* Spinner */}
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>

            {/* Main message */}
            <p className="text-xl font-semibold">{message}</p>

            {/* Sub message */}
            {subMessage && (
                <p className="text-gray-500 text-sm mt-1">{subMessage}</p>
            )}
        </div>
    );
}