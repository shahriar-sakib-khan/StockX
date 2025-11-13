export default function AddButton({ variant, onClick }) {
    const colorClass =
        variant === "give"
            ? "bg-green-600 hover:bg-green-700"
            : "bg-blue-600 hover:bg-blue-700";

    return (
        <button
            onClick={onClick}
            className={`${colorClass} rounded-xl px-5 py-2 text-white shadow transition-all`}
        >
            + Add Cylinders
        </button>
    );
}
