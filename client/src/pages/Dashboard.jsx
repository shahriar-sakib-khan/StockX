import { useMutation } from "@tanstack/react-query";
import { logout } from "../features/authentication/services/authServices";
import queryClient from "../services/queryClient";
import { useNavigate } from "react-router-dom";
import { Button } from "../components";
import useAuth from "../hooks/useAuth";
import { useEffect } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { username } = user.user;

  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  useEffect(() => {
    console.log(user);
  });

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold text-gray-700">Hello {username}</h1>
      <p className="text-xl text-gray-500">You are logged in</p>
      <Button onClick={signOut} className="mt-4 px-2 py-1 font-semibold">
        Sign out
      </Button>
    </div>
  );
}
