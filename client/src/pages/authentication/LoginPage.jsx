import { NavLink } from "react-router-dom";
import { FormInput } from "../../components";
import { LoginForm } from "../../features";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl font-semibold mb-4">Welcome back</div>
      <LoginForm />
    </div>
  );
}
