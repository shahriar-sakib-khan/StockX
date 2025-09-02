import API from "../../../services/apiClient";

// Get all global brands
// export const getGlobalBrands = async (workspaceId, divisionId) =>
//     await API.get(
//         `/workspace/${workspaceId}/divisions/${divisionId}/inventory/global-brands`,
//     );

// Get all brands in a division (list only)
export const getDivisionBrands = async (workspaceId, divisionId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/brands`,
    );

// Get all brands in a division (detailed)
export const getDetailedDivisionBrands = async (workspaceId, divisionId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/brands/d`,
    );

// Select brands in a division
export const saveSelectedDivisionBrands = async (
    workspaceId,
    divisionId,
    brands,
) =>
    await API.patch(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/brands`,
        {
            brands, // {list of {id, isActive}}
        },
    );

// Get all cylinders in a division
export const getCylinders = async (workspaceId, divisionId) =>
    await API.get(
        `/workspace/${workspaceId}/divisions/${divisionId}/inventory/cylinders`,
    );
