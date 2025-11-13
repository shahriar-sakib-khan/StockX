export default function GivenCylinders({ items = [] }) {
    return (
        <>
            <div className="mt-6 mb-2 text-sm font-bold tracking-wider text-gray-700 uppercase">
                Given Cylinders
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
                    <div className="col-span-1 text-right">
                        {Number(item.price).toLocaleString()}
                    </div>
                    <div className="col-span-2 text-right font-semibold">
                        {Number(item.price * item.quantity).toLocaleString()}
                    </div>
                </div>
            ))}
        </>
    );
}
