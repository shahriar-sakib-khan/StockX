import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getUserInvites,
    acceptInvite,
    declineInvite,
} from "@/features/authentication/services/authServices";
import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components";
import { FaArrowLeft, FaEnvelopeOpenText, FaStore, FaCheck, FaTimes } from "react-icons/fa";

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
            await acceptInvite(invite.token);

            setCurrentStore(invite.store);
            setAllStores([...allStores, invite.store]);

            navigate("/dashboard", { replace: true });
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["invites"]);
        },
    });

    // Decline invite
    const declineMutation = useMutation({
        mutationFn: (token) => declineInvite(token),
        onSuccess: () => queryClient.invalidateQueries(["invites"]),
    });

    const invites = data?.invites || [];

    return (
        <div className="flex min-h-screen w-full flex-col items-center bg-gray-50 px-4 py-8">
            {/* Header / Back Link */}
            <div className="mb-8 w-full max-w-2xl">
                <button
                    onClick={() => navigate("/addStore")}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
                >
                    <FaArrowLeft /> Back to Create Store
                </button>
            </div>

            <div className="w-full max-w-2xl">
                <h1 className="mb-2 text-2xl font-bold text-gray-800 md:text-3xl">
                    Store Invitations
                </h1>
                <p className="mb-8 text-gray-500">
                    Manage your pending invitations to join existing stores.
                </p>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex h-40 w-full items-center justify-center rounded-xl bg-white shadow-sm">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}

                {/* Error State */}
                {isError && (
                    <div className="mb-4 rounded-lg bg-red-50 p-4 text-center text-sm text-red-600 border border-red-100">
                        Failed to load invites. Please try refreshing the page.
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !isError && invites.length === 0 && (
                    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                        <div className="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
                            <FaEnvelopeOpenText className="text-3xl" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">No pending invites</h3>
                        <p className="mt-1 text-gray-500">
                            You're all caught up! Ask your admin to send you an invite if you're missing one.
                        </p>
                    </div>
                )}

                {/* Invites List */}
                <div className="space-y-4">
                    {invites.map((invite) => (
                        <div
                            key={invite.id}
                            className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
                        >
                            {/* Left: Store Info */}
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <FaStore className="text-xl" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {invite.store.name}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Role:</span>
                                        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-gray-600">
                                            {invite.role}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex gap-3 sm:w-auto">
                                <Button
                                    label="Join"
                                    isLoading={acceptMutation.isPending || acceptMutation.isLoading}
                                    onClick={() => acceptMutation.mutate(invite)}
                                    // Override default styles for a "Success" look
                                    className="flex-1 gap-2 !bg-green-600 hover:!bg-green-700 sm:flex-none"
                                >
                                    <FaCheck className="text-sm" />
                                    <span className="sm:hidden">Join</span> {/* Text visible only on mobile if space is tight, or keep standard */}
                                </Button>

                                <Button
                                    label="Decline"
                                    isLoading={declineMutation.isPending || declineMutation.isLoading}
                                    onClick={() => declineMutation.mutate(invite.token)}
                                    // Override default styles for a "Danger/Secondary" look
                                    className="flex-1 gap-2 border border-gray-300 !bg-white !text-red-600 hover:!bg-red-50 hover:border-red-200 sm:flex-none"
                                >
                                    <FaTimes className="text-sm" />
                                    <span className="sm:hidden">Decline</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
