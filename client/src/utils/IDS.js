import { useAuthStore } from "@/stores/useAuthStore";

export const workspaceId = useAuthStore((state) => state.currentWorkspace).id ||  "68b6b165bf7b8d95d4f1a0a0";
export const divisionId = useAuthStore((state) => state.currentDivision).id || "68b6b177bf7b8d95d4f1a0ab";
