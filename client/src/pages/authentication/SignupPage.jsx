import { NavLink } from 'react-router-dom';
import { SignupForm } from '../../features';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-2xl font-semibold mb-4">Create New Account</div>
      <SignupForm />
      <NavLink to="/" className="text-sm text-gray-600 mt-4">
        Back to home
      </NavLink>
    </div>
  );
}
