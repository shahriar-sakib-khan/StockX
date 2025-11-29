import Spinner from "../mini/Spinner";

export default function LoadingComponent() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-3">
                <Spinner size={40} className="text-indigo-600" />
                <p className="text-sm font-medium text-gray-500 animate-pulse">
                    Loading resources...
                </p>
            </div>
        </div>
    );
}
