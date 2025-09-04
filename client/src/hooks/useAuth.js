// @ts-check
import { useQuery } from "@tanstack/react-query";
import { getUser } from "../features/authentication/services/authServices";
import { AUTH } from "../constants/queryKeys";

/** @typedef {import("@/types/auth").GetUserResponse} GetUserResponse */
/** @typedef {import("@/constants/queryKeys").QueryKey} QueryKey */

/**
 * Custom hook to fetch the currently authenticated user.
 * @param {Partial<import("@tanstack/react-query").UseQueryOptions<GetUserResponse, unknown, GetUserResponse, [QueryKey]>>} [options] - Optional query options
 */
const useAuth = (options) => {
    /** @type {import("@tanstack/react-query").UseQueryResult<GetUserResponse, unknown>} */
    const query = useQuery({
        queryKey: [AUTH],
        queryFn: getUser,
        staleTime: Infinity,
        ...options,
    });

    return query;
};

export default useAuth;
