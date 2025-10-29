import API from "@/services/apiClient";

/**
 * Mark or unmark cylinders as defected.
 */
export const markDefected = async ({
    storeId,
    size,
    regulatorType,
    doMark,
    payload,
}) => {
    const data = await API.patch(`/stores/${storeId}/cylinders/mark`, payload, {
        params: { size, regulatorType, doMark },
    });

    return data;
};
