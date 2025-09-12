import {
    getMyWorkspaces,
    getWorkspaceDivisions,
} from "../features/authentication/services/authServices";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

export default function SelectWorkspace() {
    const navigate = useNavigate();
    const { setWorkspace, setDivision, setDivisions } = useAuthStore();
    const [workspaces, setWorkspaces] = React.useState([]);

    React.useEffect(() => {
        async function load() {
            const res = await getMyWorkspaces();
            setWorkspaces(res.workspaces || []);
        }
        load();
    }, []);

    const selectWorkspace = async (workspace) => {
        setWorkspace(workspace);

        const res = await getWorkspaceDivisions(workspace.id);
        const divisions = res?.divisions || [];
        setDivisions(divisions);
        
        if (divisions.length === 0) {
            navigate("/createDivision");
        } else if (divisions.length === 1) {
            setDivision(divisions[0]);
            navigate("/dashboard");
        } else {
            navigate("/selectDivision");
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-6">
            {workspaces.map((ws) => (
                <div
                    key={ws.id}
                    className="cursor-pointer rounded-lg border p-4 shadow hover:bg-gray-100"
                    onClick={() => selectWorkspace(ws)}
                >
                    <h2 className="font-bold">{ws.name}</h2>
                    <p>{ws.description}</p>
                </div>
            ))}
        </div>
    );
}
