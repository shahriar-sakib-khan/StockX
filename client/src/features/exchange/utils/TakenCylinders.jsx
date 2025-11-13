export default function TakenCylinders({ items = [] }) {
    return (
        <>
            <div className="mt-6 mb-2 text-sm font-bold tracking-wider text-gray-700 uppercase">
                Taken Cylinders
            </div>

            {items.map((item) => (
                <div
                    key={item.id}
                    className="grid grid-cols-12 items-center border-b border-gray-200 py-1 text-sm"
                >
                    <div className="col-span-4 font-medium capitalize">
                        {item.brand}
                    </div>
                    <div className="col-span-2">{item.regulatorType}</div>
                    <div className="col-span-2">{item.size}kg</div>
                    <div className="col-span-1">{item.quantity}</div>
                </div>
            ))}

            <hr className="my-4 border-gray-300" />
        </>
    );
}
