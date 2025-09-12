import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import React from "react";
import { getWorkspaceDivisions } from "../features/authentication/services/authServices";

export default function SelectDivision() {
    const { currentWorkspace, setDivision } = useAuthStore();
    const navigate = useNavigate();
    const [divisions, setDivisions] = React.useState([]);

    React.useEffect(() => {
        async function load() {
            const res = await getWorkspaceDivisions(currentWorkspace.id);
            setDivisions(res?.divisions || []);
        }
        load();
    }, [currentWorkspace]);

    const selectDivision = (division) => {
        setDivision(division);
        navigate("/dashboard");
    };

    return (
        <div className="grid grid-cols-3 gap-4 p-6">
            {divisions.map((div) => (
                <div
                    key={div.id}
                    className="cursor-pointer rounded-lg border p-4 shadow hover:bg-gray-100"
                    onClick={() => selectDivision(div)}
                >
                    <h2 className="font-bold">{div.name}</h2>
                    <p>{div.description}</p>
                </div>
            ))}
        </div>
    );
}
