import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormInputField } from "../components";
import useInput from "../hooks/useInput";
import { createStore } from "../features/authentication/services/authServices";
import { useAuthStore } from "../stores/useAuthStore";

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
        if (!name || !location || !phone) {
            alert("Please fill in all fields");
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
                image: store.image ?? "store.storeImageUrl", // fallback if missing
                location: store.location,
                phone: store.phone,
            };

            // Update Zustand store
            setAllStores([...allStores, newStore]);
            setCurrentStore(newStore);

            // Redirect to dashboard
            navigate("/selectBrands", { replace: true });
        } catch (err) {
            console.error("Failed to create store:", err);
            setErrorMsg(
                err?.response?.data?.message || "Failed to create store",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = () => {
        navigate("/invitations", { replace: true });
    };

    return (
        <section className="mx-auto mt-16 flex max-w-md flex-col gap-4 rounded-lg border-0 border-gray-300 bg-white p-8 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold">
                Create Store
            </h2>

            <FormInputField
                id="name"
                type="text"
                placeholder="Store Name"
                label="Name"
                {...nameObj}
                className="min-w-[35ch]"
            />

            <FormInputField
                id="location"
                type="text"
                placeholder="Store Location"
                label="Location"
                {...locationObj}
                className="min-w-[35ch]"
            />

            <FormInputField
                id="phone"
                type="text"
                placeholder="Phone Number"
                label="Phone"
                {...phoneObj}
                className="min-w-[35ch]"
            />

            {errorMsg && (
                <span className="text-center text-red-500">{errorMsg}</span>
            )}

            <Button
                label="Create Store"
                className="mt-4"
                onClick={handleSubmit}
                isLoading={isLoading}
            />

            <div className="my-4 flex items-center gap-2">
                <hr className="flex-1 border-gray-300" />
                <span className="text-gray-500">or</span>
                <hr className="flex-1 border-gray-300" />
            </div>

            <Button
                label="Join store via invitation"
                className="mt-4"
                onClick={handleClick}
                isLoading={isLoading}
            />
        </section>
    );
}
