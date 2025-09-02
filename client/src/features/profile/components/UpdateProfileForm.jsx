import useInput from "../../../hooks/useInput";
import { useMutation } from "@tanstack/react-query";
import { updateUser } from "../../authentication/services/authServices";
import { FormInputField } from "../../../components";
import { useEffect } from "react";

export default function UpdateProfileForm({
    data,
    refetch = () => {},
    toggleEditOpen = () => {},
}) {
    const {
        firstName: fname,
        lastName: lname,
        username: uname,
        email: eml,
        address: addr,
    } = data?.user || {};

    const [firstName, resetFirstName, firstNameObj] = useInput(
        "updateFirstName",
        fname,
    );
    const [lastName, resetLastName, lastNameObj] = useInput(
        "updateLastName",
        lname,
    );

    const [username, resetUsername, usernameObj] = useInput(
        "updateUsername",
        uname,
    );
    const [email, resetEmail, emailObj] = useInput("updateEmail", eml);
    const [address, resetAddress, addressObj] = useInput("updateAddress", addr);

    const resetValues = () => {
        resetFirstName();
        resetLastName();
        resetEmail();
        resetUsername();
        resetAddress();
    };

    useEffect(() => {
        resetValues();
    }, resetValues);

    const {
        mutate: updateInfo,
        isError,
        error,
    } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            refetch();
            toggleEditOpen();
        },
    });

    const handleUpdate = (event) => {
        if (event && typeof event.preventDefault === "function") {
            event.preventDefault();
        }
        updateInfo({
            firstName,
            lastName,
            username,
            email,
            address,
        });
    };

    const handleCancel = () => {
        toggleEditOpen();
    };

    return (
        <section className="flex min-w-150 flex-col gap-2 rounded-lg border-1 border-gray-300 p-4 text-gray-700">
            <h2 className="font-semibold">Update Profile Information</h2>
            <div className="flex flex-col gap-2">
                <FormInputField
                    id="firstName"
                    type="text"
                    placeholder="Enter first name"
                    label="First Name"
                    {...firstNameObj}
                />
                <FormInputField
                    id="lastName"
                    type="text"
                    placeholder="Enter last name"
                    label="Last Name"
                    {...lastNameObj}
                />
                <FormInputField
                    id="username"
                    type="text"
                    placeholder="Username"
                    label="Username"
                    {...usernameObj}
                />
                <FormInputField
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    label="Email"
                    {...emailObj}
                />
                <FormInputField
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    label="Address"
                    {...addressObj}
                />
                {isError && (
                    <span className="text-md text-center text-red-400">
                        {error?.message || "Information update failed"}
                    </span>
                )}
            </div>
            <div className="mt-2 flex items-center justify-end gap-4">
                <button
                    onClick={handleUpdate}
                    className="cursor-pointer rounded-sm border-1 border-gray-400 px-2 py-1 text-sm font-semibold"
                >
                    Save changes
                </button>
                <button
                    onClick={handleCancel}
                    className="cursor-pointer rounded-sm border-1 border-gray-400 px-2 py-1 text-sm font-semibold"
                >
                    Cancel
                </button>
            </div>
        </section>
    );
}
