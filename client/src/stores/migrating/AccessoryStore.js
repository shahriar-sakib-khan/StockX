import { create } from "zustand";
import { persist } from "zustand/middleware";
import { baseRegulator, baseStove } from "./baseLists/base_accessory";

const clampValue = (value) => Math.max(0, Number(value));

// 🟢 general methods
// 🟣 item access methods
// 🟡 regulator related methods
// 🔵 stove related methods

export const useAccessoryStore = create(
  persist(
    (set, get) => ({
      regulator: { ...baseRegulator },      // confirmed regulators list
      stove: { ...baseStove },              // confirmed stoves list

      draftRegulator: { ...baseRegulator }, // for display/editing [temporary]
      draftStove: { ...baseStove },         // for display/editing [temporary]

      // 🟢 Initialize or sync all draft accessories with committed on mount
      initializeDraftAccessories: () => {
        const { regulator, stove } = get();
        set({
          draftRegulator: { ...regulator },
          draftStove: { ... stove }
        })
      },

      // 🟢 Initialize or sync draft regulator with committed on mount
      initializeDraftRegulator: () => {
        const { regulator } = get();
        set({ draftRegulator: { ...regulator } })
      },

      // 🟢 Initialize or sync draft stove with committed on mount
      initializeDraftStove: () => {
        const { stove } = get();
        set({ draftStove: { ... stove } })
      },

      // 🟢 Submit draft to confirm all changes
      submitAccessoryChanges: () => {
        const { draftRegulator, draftStove } = get();
        set({ regulator: { ...draftRegulator }, stove: { ...draftStove } })
      },

      // 🟢 Submit draft to confirm regulator changes 
      submitRegulatorChanges: () => {
        const { draftRegulator } = get();
        set({ regulator: { ...draftRegulator } })
      },
      
      // 🟢 Submit draft to confirm stove changes 
      submitStoveChanges: () => {
        const { draftStove } = get();
        set({ stove: { ...draftStove } })
      },

      // 🟣 get the stock of regulators
      getRegulatorStock: () => get().regulator.stock,

      // 🟣 get the stock of stoves
      getStoveStock: () => get().stove.stock,

      // 🟢 undo changes for all accessories
      clearAccessoriesChanges: () => get().initializeDraftAccessories(),

      // 🟢 undo regulator changes
      clearRegulatorChanges: () => get().initializeDraftRegulator(),

      // 🟢 undo stove changes
      clearStoveChanges: () => get().initializeDraftStove(),

      // 🟢 undo regulator changes
      clearRegulatorStockChanges: () => {
        const { getRegulatorStock, setRegulatorStock } = get();
        const st = getRegulatorStock();
        setRegulatorStock(st);
      },

      // 🟢 undo stove changes
      clearStoveStockChanges: () => {
        const { getStoveStock, setStoveStock } = get();
        const st = getStoveStock();
        setStoveStock(st);
      },

      // 🟢 Check if the drafts have uncommitted changes
      hasUncommittedChanges: () => {
        const { regulator, draftRegulator, stove, draftStove } = get();
        return (
          JSON.stringify(regulator) !== JSON.stringify(draftRegulator) ||
          JSON.stringify(stove) !== JSON.stringify(draftStove)
        );
      },


      // 🟡 set any or all properties of the regulators
      setRegulator: (item) => {
        const { draftRegulator } = get();
        set({ draftRegulator: { ...draftRegulator, ...item, productType: "regulator" }})
      },
      
      // 🟡 set the price of the regulators
      setRegulatorPrice: (newPrice) => {
        const { draftRegulator } = get();
        set({ draftRegulator: { ...draftRegulator, price: clampValue(newPrice) }})
      },

      // 🔵 set the stock of the stoves
      setRegulatorStock: (newStock) => {
        const { draftRegulator } = get();
        set({ draftRegulator: { ...draftRegulator, stock: clampValue(newStock) }})
      },
      
      // 🟡 update stock of regulators
      updateRegulatorStock: (stockChange) => {
        const { draftRegulator } = get();
        set({ draftRegulator: { ...draftRegulator, stock: clampValue(draftRegulator.stock + stockChange)}})
      },


      // 🔵 set any or all properties of the stoves
      setStove: (item) => {
        const { draftStove } = get();
        set({ draftStove: { ...draftStove, ...item, productType: "stove" }})
      },
      
      // 🔵 set the price of the stoves
      setStovePrice: (newPrice) => {
        const { draftStove } = get();
        set({ draftStove: { ...draftStove, price: clampValue(newPrice) }})
      },

      // 🔵 set the stock of the stoves
      setStoveStock: (newStock) => {
        const { draftStove } = get();
        set({ draftStove: { ...draftStove, stock: clampValue(newStock) }})
      },
      
      // 🔵 update stock of stoves
      updateStoveStock: (stockChange) => {
        const { draftStove } = get();
        set({ draftStove: { ...draftStove, stock: clampValue(draftStove.stock + stockChange)}})
      },
    }),
    {
      name: "accessory-store",
      partialize: (state) => ({
        regulator: state.regulator,
        stove: state.stove,
      }),
    }
  )
);
