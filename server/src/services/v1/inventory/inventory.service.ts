// export const updateCylinderStock = async () => {
//   // Handle StockMovements if cylinders involved
//   if (payload.cylindersSold && payload.cylindersSold.length > 0) {
//     for (const item of payload.cylindersSold) {
//       await StockMovement.create({
//         workspaceId: payload.workspaceId,
//         divisionId: payload.divisionId,
//         type: 'sale',
//         itemType: 'cylinder',
//         brand: '', // optional, could fetch from Cylinder
//         quantity: -item.quantity,
//         unit: 'unit',
//         transactionId: tx._id,
//         meta: { cylinderId: item.cylinderId },
//       });

//       // Update cylinder count
//       await Cylinder.updateOne({ _id: item.cylinderId }, { $inc: { count: -item.quantity } });
//     }
//   }

//   // Handle empty cylinder returns (swap)
//   if (payload.emptyCylindersReturned && payload.emptyCylindersReturned.length > 0) {
//     for (const item of payload.emptyCylindersReturned) {
//       await StockMovement.create({
//         workspaceId: payload.workspaceId,
//         divisionId: payload.divisionId,
//         type: 'swap',
//         itemType: 'cylinder',
//         brand: '',
//         quantity: item.quantity,
//         unit: 'unit',
//         transactionId: tx._id,
//         meta: { cylinderId: item.cylinderId },
//       });

//       await Cylinder.updateOne({ _id: item.cylinderId }, { $inc: { count: item.quantity } });
//     }
//   }
// };

// export default { updateCylinderStock };
