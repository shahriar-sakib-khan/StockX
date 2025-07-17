import { FormInputField } from "../../../components";

export default function UpdatePasswordForm() {
  return (
    <section className="flex min-w-150 flex-col gap-2 rounded-lg border-1 border-gray-300 p-4 text-gray-700">
      <h2 className="font-semibold">Update Password</h2>
      {/* <div className="flex flex-col gap-2">
        <FormInputField
          id="password"
          type="password"
          placeholder="Enter old password"
          label="Old Password"
          {...oldPasswordObj}
        />
        <FormInputField
          id="password"
          type="password"
          placeholder="Enter new password"
          label="New Password"
          {...newPasswordObj}
        />
        <FormInputField
          id="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          label="Confirm New Password"
          {...confirmNewPasswordObj}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {isError && (
          <span className="text-md text-center text-red-400">
            {error?.message || "Information update failed"}
          </span>
        )}
      </div> */}
    </section>
  );
}
