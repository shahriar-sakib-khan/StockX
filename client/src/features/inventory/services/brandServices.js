import API from "../../../services/apiClient";

// Get all brands in a division (list only)
export const getDivisionBrands = async (workspaceId, divisionId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/all-brands`,
    );

// Get all brands in a division (detailed)
export const getDetailedDivisionBrands = async (workspaceId, divisionId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/all-brands/d`,
    );

// Select brands in a division
export const saveSelectedDivisionBrands = async (
    workspaceId,
    divisionId,
    brands,
) =>
    await API.patch(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/brands`,
        brands,
    );

// Get all cylinders in a division
// export const getCylinders = async (workspaceId, divisionId) =>
//     await API.get(
//         `/workspace/${workspaceId}/divisions/${divisionId}/inventory/cylinders`,
//     );
