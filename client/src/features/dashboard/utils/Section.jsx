export const Section = ({ children, className = "" }) => {
    return (
        <section className={`flex flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}>
            {children}
        </section>
    );
};
