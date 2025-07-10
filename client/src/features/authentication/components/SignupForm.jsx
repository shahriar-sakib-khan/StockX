import { NavLink, useNavigate } from 'react-router-dom';
import { Button, FormInput } from '../../../components';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../../lib/api';

export default function SignupForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {
    mutate: createAccount,
    isPending,
    isError,
  } = useMutation({
    mutationFn: register,
    onSuccess: () => {
      navigate('/', {
        replace: true,
      });
    },
  });

  return (
    <section className="flex flex-col gap-2 border-1 border-gray-300 rounded-lg p-4">
      <FormInput
        id="username"
        type="text"
        placeholder="Username"
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <FormInput
        id="email"
        type="email"
        placeholder="Enter email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        id="password"
        type="password"
        placeholder="Enter password"
        label="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <FormInput
        id="confirmPassword"
        type="password"
        placeholder="Confirm password"
        label="Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        onKeyDown={(e) =>
          e.key === 'Enter' && createAccount({ username, email, password })
        }
      />
      {isError && (
        <span className="text-md text-red-400 text-center">
          Account creation failed
        </span>
      )}
      <Button
        label="Sign up"
        className="mt-2"
        onClick={() => createAccount({ username, email, password })}
        isLoading={isPending}
        disabled={!email || password.length < 3 || password !== confirmPassword}
      />
      <div className="flex gap-2 text-sm mt-1 self-center">
        <span>Already have an account? </span>
        <NavLink to="/login" className="text-blue-500 hover:underline">
          Log in
        </NavLink>
      </div>
    </section>
  );
}
