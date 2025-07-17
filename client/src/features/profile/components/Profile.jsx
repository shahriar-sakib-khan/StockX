import pfp from "../../../assets/images/user_icon.jpeg";

export default function Profile({ data, toggleEditOpen = () => {} }) {
  const { username, firstName, lastName, email, address } = data?.user || {};

  return (
    <section className="flex min-w-150 gap-8 rounded-lg border-1 border-gray-300 p-4 text-gray-700">
      <div className="text-center">
        <div className="relative">
          <button
            className="absolute top-0 right-0 cursor-pointer rounded-sm px-1 text-sm"
            title="Upload Image"
          >
            Edit
          </button>
          <img src={pfp} alt="Logo" className="w-40 rounded-full p-1" />
        </div>
        <h2 className="font-semibold text-gray-600" title="Username">
          {username}
        </h2>
      </div>
      <div className="relative grow-1 text-sm">
        <h2 className="border-b-1 border-gray-300 text-lg font-semibold text-gray-600">
          About
        </h2>
        <div className="mt-4">
          <span className="text-gray-500">Name: </span>
          <span className="font-semibold">{firstName + " " + lastName}</span>
        </div>
        <div className="mt-1">
          <span className="text-gray-500">Email: </span>
          <span className="font-semibold">{email}</span>
        </div>
        <div className="mt-1">
          <span className="text-gray-500">Address: </span>
          <span className="font-semibold">{address}</span>
        </div>
        <button
          className="absolute right-0 bottom-0 cursor-pointer text-sm font-semibold hover:underline"
          onClick={toggleEditOpen}
        >
          Edit profile
        </button>
      </div>
    </section>
  );
}
