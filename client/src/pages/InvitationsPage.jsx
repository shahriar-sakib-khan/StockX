import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUserInvites,
    acceptInvite,
    declineInvite,
} from "@/features/authentication/services/authServices";
import { Button } from "@/components";
import { useAuthStore } from "@/stores/useAuthStore";

export default function InvitationPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Auth store
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const allStores = useAuthStore((state) => state.allStores) || [];
    const setAllStores = useAuthStore((state) => state.setAllStores);

    // Fetch all invites
    const { data, isLoading, isError } = useQuery({
        queryKey: ["invites"],
        queryFn: getUserInvites,
    });

    // Accept invite + store in auth store + redirect
    const acceptMutation = useMutation({
        mutationFn: async (invite) => {
            // call backend to accept the invite
            await acceptInvite(invite.token);

            // save the store in Zustand
            setCurrentStore(invite.store);

            // ✅ add to allStores immediately
            setAllStores([...allStores, invite.store]);

            // redirect to dashboard
            navigate("/dashboard", { replace: true });
        },
        onSuccess: () => {
            // refresh the invites list just in case
            queryClient.invalidateQueries(["invites"]);
        },
    });

    // Decline invite
    const declineMutation = useMutation({
        mutationFn: (token) => declineInvite(token),
        onSuccess: () => queryClient.invalidateQueries(["invites"]),
    });

    if (isLoading) return <div className="p-8">Loading invites…</div>;
    if (isError)
        return <div className="p-8 text-red-500">Failed to load invites</div>;

    const invites = data?.invites || [];

    return (
        <div className="flex min-h-screen flex-col items-center justify-start bg-gray-100 p-8">
            <h1 className="mb-6 text-3xl font-bold">Your Store Invitations</h1>

            {invites.length === 0 && (
                <p className="text-gray-600">No invitations at this time.</p>
            )}

            <div className="w-full max-w-lg space-y-4">
                {invites.map((invite) => (
                    <div
                        key={invite.id}
                        className="flex items-center justify-between rounded-lg bg-white p-4 shadow"
                    >
                        <div>
                            <p className="text-lg font-semibold">
                                {invite.store.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                Role: {invite.role} • Status: {invite.status}
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                label="Join"
                                isLoading={acceptMutation.isLoading}
                                onClick={() => acceptMutation.mutate(invite)}
                                className="bg-green-500 text-white hover:bg-green-600"
                            />
                            <Button
                                label="Decline"
                                isLoading={declineMutation.isLoading}
                                onClick={() =>
                                    declineMutation.mutate(invite.token)
                                }
                                className="bg-red-500 text-white hover:bg-red-600"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
