// Backend → Frontend
export const mapVehicleFromApi = (apiVehicle) => ({
    id: apiVehicle.id,
    brand: apiVehicle.vehicleBrand,
    model: apiVehicle.vehicleModel,
    regNo: apiVehicle.regNumber,
});

// Frontend → Backend
export const mapVehicleToApi = (vehicle) => ({
    vehicleBrand: vehicle.brand,
    vehicleModel: vehicle.model,
    regNumber: vehicle.regNo,
});
