import API from "@/services/apiClient";

/**
 * Mark or unmark cylinders as defected.
 */
export const markDefected = async ({
    storeId,
    size,
    regulatorType,
    isDefected,
    payload,
}) => {
    const data = await API.patch(
        `/stores/${storeId}/cylinders/mark-defected`,
        payload,
        { params: { size, regulatorType, isDefected } },
    );

    return data;
};
