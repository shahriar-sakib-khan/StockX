import { useEffect, useState } from "react";
import { createVehicle, getVehicles } from "../services/vehicleServices";
import { divisionId, workspaceId } from "@/constants/ids";

export default function TestVehicles() {
    useEffect(() => {
        async function fetchBrands() {
            try {
                const data = await getVehicles(workspaceId, divisionId);

                console.log("Server response:", data);
            } catch (err) {
                console.error("Error fetching vehicles", err);
            }
        }

        fetchBrands();
    }, []);

    const [vehicle] = useState({
        regNumber: Date.now().toString(),
        vehicleBrand: "Begun",
        vehicleModel: "Alu",
    });

    const onSubmit = async () => {
        try {
            const res = await createVehicle(workspaceId, divisionId, vehicle);
            console.log("Vehicle created:", res);
        } catch (err) {
            console.error("Error creating vehicle:", err);
        }
    };

    return (
        <div className="rounded border bg-gray-50 p-4">
            Check console for server response
            <button onClick={onSubmit}>Click Me</button>
        </div>
    );
}
