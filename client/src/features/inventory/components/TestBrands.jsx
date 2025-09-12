import { useEffect } from "react";
import {
    getDetailedBrands,
    getBrands,
} from "../../brands/services/brandServices";
import { useAuthStore } from "@/stores/useAuthStore";

export default function TestBrands() {
    const workspaceId = useAuthStore((state) => state.currentWorkspace).id;
    const divisionId = useAuthStore((state) => state.currentDivision).id;
    
    useEffect(() => {
        async function fetchBrands() {
            try {
                const data = await getBrands(workspaceId, divisionId);

                console.log("Server response:", data);
            } catch (err) {
                console.error("Error fetching local brands:", err);
            }

            try {
                const dataD = await getDetailedBrands(workspaceId, divisionId);

                console.log("Server response2:", dataD);
            } catch (err) {
                console.error("Error fetching detailed local brands", err);
            }
        }

        fetchBrands();
    }, []);

    return (
        <div className="rounded border bg-gray-50 p-4">
            Check console for server response
        </div>
    );
}
