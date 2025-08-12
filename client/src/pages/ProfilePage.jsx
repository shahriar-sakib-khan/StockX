import { Profile, UpdatePasswordForm, UpdateProfileForm } from "../features";
// import useAuth from "../hooks/useAuth";
// import useToggle from "../hooks/useToggle";

export default function ProfilePage() {
  // const [editOpen, toggleEditOpen] = useToggle("editOpen", false);
  // const { data, refetch } = useAuth();

  return (
    <div className="wrapper flex h-[var(--height-with-nav-titlebar)] flex-col items-center gap-4 pt-4">
      <h1 className="text-left text-2xl font-semibold text-gray-700">
        Profile
      </h1>
      {/* <Profile
        data={data}
        editOpen={editOpen}
        toggleEditOpen={toggleEditOpen}
      />
      {editOpen && (
        <div className="mb-4 flex flex-col gap-4">
          <UpdateProfileForm
            data={data}
            refetch={refetch}
            editOpen={editOpen}
            toggleEditOpen={toggleEditOpen}
          />
          <UpdatePasswordForm />
        </div>
      )} */}
    </div>
  );
}
