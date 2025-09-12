import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, FormInputField } from "../components";
import useInput from "../hooks/useInput";
import { useAuthStore } from "../stores/useAuthStore";
import { CreateDivision } from "../features/authentication/services/authServices";

export default function CreateDivisionPage() {
    const navigate = useNavigate();
    const { currentWorkspace, addDivision } = useAuthStore(); // 👈 access store
    const [workspaceId, setWorkspaceId] = useState(null);

    // Load workspaceId from store
    useEffect(() => {
        if (currentWorkspace) {
            setWorkspaceId(currentWorkspace.id);
        }
    }, [currentWorkspace]);

    const [name, resetName, nameObj] = useInput("name", "");

    const {
        mutate: createDivision,
        isPending,
        isError,
        error,
        data,
    } = useMutation({
        mutationFn: ({ name, workspaceId }) =>
            CreateDivision({ name }, workspaceId),
        onSuccess: (res) => {
            console.log("✅ Division created:", res);
            if (res.division) {
                addDivision(res.division);
            }
            // redirect to dashboard
            setTimeout(() => navigate("/dashboard", { replace: true }), 2000);
        },
    });

    const handleSubmit = () => {
        if (!workspaceId) {
            console.error("❌ No workspaceId found!");
            return;
        }
        createDivision({ name, workspaceId });
    };

    return (
        <section className="flex flex-col gap-4 rounded-lg border-0 border-gray-300 bg-white p-8 shadow-lg">
            <FormInputField
                id="name"
                type="text"
                placeholder="Division name"
                label="Division Name"
                {...nameObj}
                className="min-w-[35ch]"
            />

            {isError && (
                <span className="text-md text-center text-red-400">
                    {error?.message || "Division creation failed"}
                </span>
            )}

            {data && (
                <span className="text-md text-center text-green-500">
                    ✅ {data.message} — <strong>{data.division?.id}</strong>
                    <br />
                    <small>Redirecting to dashboard...</small>
                </span>
            )}

            <Button
                label="Create Division"
                className="mt-2"
                onClick={handleSubmit}
                isLoading={isPending}
            />
        </section>
    );
}
