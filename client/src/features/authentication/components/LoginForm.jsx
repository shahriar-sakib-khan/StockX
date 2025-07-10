// import { useRef } from 'react';
import { Button, FormInput } from '../../../components';
import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../../lib/api';
// import { useEffect } from 'react';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const {
    mutate: signIn,
    isPending,
    isError,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate('/', {
        replace: true,
      });
    },
  });

  return (
    <section className="flex flex-col gap-2 border-1 border-gray-300 rounded-lg p-4">
      <FormInput
        id="email"
        type="email"
        label="Email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <FormInput
        id="password"
        type="password"
        label="Password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && signIn({ email, password })}
        className="mt-2"
      />
      {isError && (
        <span className="text-md text-red-400 text-center">
          Invalid email or password
        </span>
      )}
      <Button
        label="Log in"
        className="mt-2"
        disabled={!email || password.length < 3}
        isLoading={isPending}
        onClick={() => signIn({ email, password })}
      />
      <div className="flex gap-2 text-sm mt-1 self-center">
        <span>Don't have an account? </span>
        <NavLink to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </NavLink>
      </div>
    </section>
  );
}
