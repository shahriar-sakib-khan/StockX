import { useQuery } from "@tanstack/react-query";
import { getUser } from "../features/authentication/services/authServices";

export const AUTH = "user";

const useAuth = (options = {}) => {
    const { data, ...rest } = useQuery({
        queryKey: [AUTH],
        queryFn: getUser,
        staleTime: Infinity, // keep cached indefinitely
        ...options,
    });

    return { data, ...rest };
};

export default useAuth;
