import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { data } = useAuth();
  const { username, role } = data?.user || {};

  return (
    <div className="flex h-[var(--height-with-nav)] flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold text-gray-700">Hello {username}</h1>
      <p className="text-xl text-gray-500">You are logged in as "{role}"</p>
    </div>
  );
}
