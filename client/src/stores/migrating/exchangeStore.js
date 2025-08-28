import { create } from "zustand";
import { persist } from "zustand/middleware";

const isMatch = (existing, item) => {
  const isCylinder = item.productType === "cylinder";
  return isCylinder
    ? existing.id === item.id && existing.type === item.type && existing.size === item.size
    : existing.productType === item.productType && existing.name === item.name;
}

const mergeOrAddItem = (itemsList, item) => {
  let alreadyExists = false;

  const updated = itemsList.map(existing => {
    if (isMatch(existing, item)) {
      alreadyExists = true;
      return { ...existing, ...item, count: existing.count + item.count };
    }
    return existing;
  })

  if (!alreadyExists) {
    updated.push(item);
  
    updated.sort((a, b) => {
      const typeCompare = a.productType.localeCompare(b.productType);
      if (typeCompare !== 0) return typeCompare;
      return a.name.localeCompare(b.name);
    });
  }
    

  return updated;
}

const removeItem = (itemsList, item) => {
  return itemsList.filter(existing => !isMatch(existing, item));
}

const updateItem = (itemsList, prevItem, updatedItem) => {
  return itemsList.map(existing => {
    if (isMatch(existing, prevItem)) {
      return { ...existing, ...updatedItem };
    }
    return existing;
  })
}

// 🟢 general methods
// 🟡 delivered items related methods
// 🔵 received items related methods

export const useExchangeStore = create(
  persist(
    (set, get) => ({
      deliveredItems: [],
      receivedItems: [],

      // 🟢 Clear both lists
      clearAllExchangeData: () => set({ deliveredItems: [], receivedItems: [] }),

      // 🟢 Clear delivered items list
      clearDeliveredItems: () => set({ deliveredItems: [] }),

      // 🟢 Clear received items list
      clearReceivedItems: () => set({ receivedItems: [] }),


      // 🟡 Add new or update an existing delivered item
      addDeliveredItem: (item) => {
        const { deliveredItems } = get();
        set({ deliveredItems: mergeOrAddItem(deliveredItems, item) });
      },

      // 🟡 Remove a delivered item
      removeDeliveredItem: (item) => {
        const { deliveredItems } = get();
        set({ deliveredItems: removeItem(deliveredItems, item) });
      },

      // 🟡 Update a delivered item
      updateDeliveredItem: (prevItem, updatedItem) => {
        const { deliveredItems } = get();
        set({ deliveredItems: updateItem(deliveredItems, prevItem, updatedItem) });
      },

      // 🔵 Add or update a received item (only cylinders)
      addReceivedItem: (item) => {
        const { receivedItems } = get();
        set({ receivedItems: mergeOrAddItem(receivedItems, item) });
      },

      // 🔵 Remove a received item
      removeReceivedItem: (item) => {
        const { receivedItems } = get();
        set({ receivedItems: removeItem(receivedItems, item) });
      },

      // 🔵 Update a received item
      updateReceivedItem: (prevItem, updatedItem) => {
        const { receivedItems } = get();
        set({ receivedItems: updateItem(receivedItems, prevItem, updatedItem) });
      },
    }),
    {
      name: "exchange-storage",
      partialize: (state) => ({
        deliveredItems: state.deliveredItems,
        receivedItems: state.receivedItems,
      }),
    }
  )
);
