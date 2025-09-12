import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Button, FormInputField } from "../components";
import useInput from "../hooks/useInput";
import { CreateWorkspace } from "../features/authentication/services/authServices";
import { useAuthStore } from "../stores/useAuthStore";

export default function CreateWorkspacePage() {
    const navigate = useNavigate();
    const setWorkspace = useAuthStore((state) => state.setWorkspace);

    const [name, resetName, nameObj] = useInput("name", "");

    const {
        mutate: createWorkspace,
        isPending,
        isError,
        error,
        data,
    } = useMutation({
        mutationFn: CreateWorkspace,
        onSuccess: (res) => {
            console.log("✅ Workspace created:", res);
            if (res.workspace) {
                setWorkspace(res.workspace);
            }
            setTimeout(() => {
                navigate("/createDivision", { replace: true });
            }, 2000);
        },
    });

    const handleSubmit = () => {
        if (!name) return;
        createWorkspace({ name });
    };

    return (
        <section className="flex flex-col gap-4 rounded-lg border-0 border-gray-300 bg-white p-8 shadow-lg">
            <FormInputField
                id="name"
                type="text"
                placeholder="Workspace name"
                label="Workspace Name"
                {...nameObj}
                className="min-w-[35ch]"
            />

            {isError && (
                <span className="text-md text-center text-red-400">
                    {error?.message || "Workspace creation failed"}
                </span>
            )}

            {data && (
                <span className="text-md text-center text-green-500">
                    ✅ {data.message} — <strong>{data.workspace?.id}</strong>
                    <br />
                    <small>Redirecting to create division...</small>
                </span>
            )}

            <Button
                label="Create Workspace"
                className="mt-2"
                onClick={handleSubmit}
                isLoading={isPending}
            />
        </section>
    );
}
