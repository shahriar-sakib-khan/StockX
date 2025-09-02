import { useEffect } from "react";
import {
    getDetailedDivisionBrands,
    getDivisionBrands,
} from "../services/brandServices";
import { divisionId, workspaceId } from "../../../utils/IDS";

export default function TestBrands() {
    useEffect(() => {
        async function fetchBrands() {
            try {
                const data = await getDivisionBrands(workspaceId, divisionId);

                console.log("Server response:", data);
            } catch (err) {
                console.error("Error fetching local brands:", err);
            }

            try {
                const dataD = await getDetailedDivisionBrands(
                    workspaceId,
                    divisionId,
                );

                console.log("Server response2:", dataD);
            } catch (err) {
                console.error("Error fetching detailed local brands", err);
            }
        }

        fetchBrands();
    }, [workspaceId, divisionId]);

    return (
        <div className="rounded border bg-gray-50 p-4">
            Check console for server response
        </div>
    );
}
