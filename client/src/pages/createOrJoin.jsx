import { NavLink, useNavigate } from "react-router-dom";



export default function CreatOrJoin() {
    const navigate = useNavigate();
  const handleWorkspace = () => {
    navigate("/createWorkspace", {
        replace: true,
      });
  };
  const handleDivision = () => {
    navigate("/createDivision", {
        replace: true,
      });
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      <button className="bg-blue-600 text-white text-3xl px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition" onClick={handleWorkspace}>
        Create Workspace
      </button>
      <button className="bg-blue-600 text-white text-3xl px-8 py-4 rounded-2xl shadow-lg hover:bg-blue-700 transition" onClick={handleDivision}>
        Join Workspace
      </button>
    </div>
  );
}
