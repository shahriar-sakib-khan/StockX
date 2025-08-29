import { useEffect } from "react";
import { getDivisionBrands, getGlobalBrands } from "../services/brandServices";

export default function TestBrands() {
  const workspaceId = "68a481f250fec8909ab2670c";
  const divisionId = "68a481f850fec8909ab26719";

  useEffect(() => {
    async function fetchBrands() {
      try {
        const data = await getDivisionBrands(workspaceId, divisionId);
        console.log("Server response:", data);
      } catch (err) {
        console.error("Error fetching global brands:", err);
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
