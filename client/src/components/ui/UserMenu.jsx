import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authentication/services/authServices";
import { useMutation } from "@tanstack/react-query";
import queryClient from "../../services/queryClient";
import { useEffect, useRef, useState } from "react";
import pfp from "../../assets/images/user_icon.jpeg";
import useAuth from "../../hooks/useAuth";

export default function UserMenu({ className = "" }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const { data } = useAuth();
  const { username, firstName, lastName } = data?.user || {};

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/", { replace: true });
    },
  });

  // close when clicked outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={["relative", className].join(" ")} ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="ml-4 flex cursor-pointer items-center space-x-2 rounded-full bg-transparent text-gray-700 transition-opacity duration-100 hover:opacity-80"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="currentColor"
        >
          <path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm246-164q-59 0-99.5-40.5T340-580q0-59 40.5-99.5T480-720q59 0 99.5 40.5T620-580q0 59-40.5 99.5T480-440Zm0 360q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q53 0 100-15.5t86-44.5q-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160Zm0-360q26 0 43-17t17-43q0-26-17-43t-43-17q-26 0-43 17t-17 43q0 26 17 43t43 17Zm0-60Zm0 360Z" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-2 z-100 mt-2 min-w-40 rounded-md bg-white p-2 shadow-lg ring-1 ring-gray-300">
          <section className="mb-2 flex gap-2 border-b-1 border-gray-300 pb-2">
            <div>
              <img src={pfp} alt="Logo" className="w-10 rounded-full" />
            </div>
            <div className="flex flex-col gap-0">
              <span className="text-sm font-semibold text-gray-600">
                {firstName + " " + lastName}
              </span>
              <span className="text-[0.8rem] text-gray-500">{username}</span>
            </div>
          </section>
          <section className="flex flex-col gap-2 text-gray-600">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="cursor-pointer rounded-sm px-2 text-start transition-all duration-100 hover:bg-gray-100"
            >
              Profile
            </button>
            <button
              onClick={() => {
                navigate("/settings");
                setOpen(false);
              }}
              className="cursor-pointer rounded-sm px-2 text-start transition-all duration-100 hover:bg-gray-100"
            >
              Settings
            </button>
            <button
              onClick={() => {
                signOut();
                setOpen(false);
              }}
              className="cursor-pointer rounded-sm px-2 text-start text-red-400 transition-all duration-100 hover:bg-gray-100"
            >
              Log out
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
