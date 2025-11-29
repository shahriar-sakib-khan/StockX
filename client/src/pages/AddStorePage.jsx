import React, { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { createStore } from "../features/authentication/services/authServices";
import { useAuthStore } from "../stores/useAuthStore";
import useInput from "../hooks/useInput";
import { Button, FormInputField } from "../components";
import { FaArrowLeft } from "react-icons/fa";

export default function AddStorePage() {
    const navigate = useNavigate();
    const allStores = useAuthStore((state) => state.allStores);
    const setAllStores = useAuthStore((state) => state.setAllStores);
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);

    const [name, , nameObj] = useInput("name", "");
    const [location, , locationObj] = useInput("location", "");
    const [phone, , phoneObj] = useInput("phone", "");

    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async () => {
        // Validation: On-screen error instead of alert()
        if (!name || !location || !phone) {
            setErrorMsg("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        setErrorMsg("");

        try {
            const res = await createStore({ name, location, phone });
            const store = res?.data || res;

            const newStore = {
                id: store.id,
                name: store.name,
                image: store.image ?? "store.storeImageUrl",
                location: store.location,
                phone: store.phone,
            };

            setAllStores([...allStores, newStore]);
            setCurrentStore(newStore);

            navigate("/selectBrands", { replace: true });
        } catch (err) {
            console.error("Failed to create store:", err);
            setErrorMsg(
                err?.errors?.[0]?.message || err?.message || "Failed to create store"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 px-4 py-8">
            {/* Header / Back Link */}
            <div className="mb-6 w-full max-w-md">
                <button
                    onClick={() => navigate("/stores")}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                >
                    <FaArrowLeft /> Back to Stores
                </button>
            </div>

            {/* Main Card */}
            <section className="flex w-full max-w-md flex-col gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-xl sm:p-8">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Create New Store
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Enter the details for your new store
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <FormInputField
                        id="name"
                        type="text"
                        placeholder="e.g. Dhanmondi Outlet"
                        label="Store Name"
                        {...nameObj}
                        className="w-full"
                    />

                    <FormInputField
                        id="location"
                        type="text"
                        placeholder="e.g. House 12, Road 5, Dhanmondi, Dhaka"
                        label="Location"
                        {...locationObj}
                        className="w-full"
                    />

                    <FormInputField
                        id="phone"
                        type="tel"
                        placeholder="e.g. 01711-XXXXXX"
                        label="Phone Number"
                        {...phoneObj}
                        className="w-full"
                    />
                </div>

                {errorMsg && (
                    <div className="rounded bg-red-50 p-3 text-center text-sm text-red-500">
                        {errorMsg}
                    </div>
                )}

                <Button
                    label="Create Store"
                    onClick={handleSubmit}
                    isLoading={isLoading}
                    className="w-full shadow-md"
                />

                {/* Divider for Secondary Action */}
                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 flex-shrink-0 text-xs text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Secondary Action: Join via Invite */}
                <div>
                    <Button
                        label="Join via Invitation"
                        onClick={() => navigate("/invitations", { replace: true })}
                        className="w-full !bg-white !text-gray-700 border border-gray-300 hover:!bg-gray-50"
                    />
                    <p className="mt-2 text-center text-xs text-gray-400">
                        Have an invite code? Join an existing team.
                    </p>
                </div>
            </section>
        </div>
    );
}
