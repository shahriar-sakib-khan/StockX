import { create } from "zustand";
import { persist } from "zustand/middleware";
import { allBrands } from "./baseLists/base_brands_list.js";

// 🟢 general methods
// 🟣 item access methods
// 🟡 brand selection methods
// 🔵 stock manipulation methods
// 🔴 price manipulation methods

export const useBrandStore = create(
  persist(
    (set, get) => ({
      allBrands: allBrands,         // static brands list
      selectedBrands: [],           // confirmed selection
      draftSelectedBrands: [],      // for display/editing [temporary]

      // 🟢 Initialize or sync draft with committed on mount
      initializeDraft: () => {
        const { selectedBrands } = get();
        set({ draftSelectedBrands: [ ...selectedBrands ] });
      },

      // 🟢 Submit draft to confirm changes 
      submitBrandChanges: () => {
        const { draftSelectedBrands } = get();
        set({ selectedBrands: [ ...draftSelectedBrands ] });
      },

      // 🟢 Submit draft to confirm selection 
      submitSelectedBrands: () => get().submitBrandChanges(),

      // 🟢 Reset draft (revert it back to last confirmed selection)
      resetSelectedBrands: () => get().initializeDraft(),

      // 🟢 clear any changes made to the draft brands
      clearBrandChanges: () => get().initializeDraft(),

      // 🟢 clear any changes made to the given cylinder stock
      clearCylinderStockChangesById: ({ brandId, cylinderId }) => {
        const { getCylinderStockById, setDraftCylinderStock } = get();
        const s = getCylinderStockById({
          brandId: brandId,
          cylinderId: cylinderId,
        });
        setDraftCylinderStock({
          brandId: brandId,
          cylinderId: cylinderId,
          newStock: s,
        });
      },

      // 🟢 Check if the draft has uncommitted changes
      hasUncommittedChanges: () => {
        const { selectedBrands, draftSelectedBrands } = get();
        return JSON.stringify(selectedBrands) !== JSON.stringify(draftSelectedBrands);
      },

      // 🟣 Get a brand by ID from selected brands
      getBrandById: (brandId) => {
        const { selectedBrands } = get();
        return selectedBrands.find((b) => b.id === brandId);
      },

      // 🟣 Get a brand by ID from draft selected brands
      getDraftBrandById: (brandId) => {
        const { draftSelectedBrands } = get();
        return draftSelectedBrands.find((b) => b.id === brandId);
      },

      // 🟣 Get the stock of a specific cylinder by ID from selected brands
      getCylinderStockById: ({ brandId, cylinderId }) => {
        const { getBrandById } = get();
        const brand = getBrandById(brandId);
        if (!brand) return 0;

        const cylinder = brand.cylinders?.find(c => c.id === cylinderId);
        return cylinder?.stock || 0;
      },

      // 🟡 Used for toggling one brand in the draft selection
      toggleSingleBrand: (id) => {
        const { draftSelectedBrands, allBrands } = get();
        const isSelected = draftSelectedBrands.some((b) => b.id === id);
        let updated;
        
        if (isSelected) {
          updated = draftSelectedBrands.filter((b) => b.id !== id)
        }
        else {
          const brandToAdd = allBrands.find((b) => b.id === id);
          if (!brandToAdd) return;
          updated = [ ...draftSelectedBrands, brandToAdd ];
        }
        
        updated = updated.sort((a, b) => (a.id > b.id ? 1 : -1));
        set({ draftSelectedBrands: updated });
      },

      // 🟡 Used for select all / deselect all in the draft
      toggleAllBrandsSelection: () => {
        const { draftSelectedBrands, allBrands } = get();
        const allSelected = draftSelectedBrands.length === allBrands.length;
        set({ draftSelectedBrands: allSelected ? [] : [ ...allBrands ] });
      },

      // 🔵 change stocks of cylinders by id
      updateDraftCylinderStock: ({ brandId, cylinderId, change }) => {
        set((state) => {
          const delta = typeof change === "number" ? change : 0;

          const updatedDraft = state.draftSelectedBrands.map((brand) => {
            if (brand.id !== brandId) return brand;

            const updatedCylinders = brand.cylinders.map((cyl) => {
              if (cyl.id !== cylinderId) return cyl;
              const currentStock = typeof cyl.stock === "number" ? cyl.stock : 0;
              return { ...cyl, stock: Math.max(0, currentStock + delta) };
            });

            // Calculate total stock of all cylinders for this brand
            const totalCylinderCount = updatedCylinders.reduce(
              (sum, cyl) => sum + (typeof cyl.stock === "number" ? cyl.stock : 0),
              0
            );

            return { ...brand, cylinders: updatedCylinders, totalCylinderCount };
          });

          return { draftSelectedBrands: updatedDraft };
        });
      },

      // 🔵 increment stock by one
      incrementDraftCylinder: ({ brandId, cylinderId }) =>
        get().updateDraftCylinderStock({ brandId, cylinderId, change: 1 }),

      // 🔵 decrement stock by one
      decrementDraftCylinder: ({ brandId, cylinderId }) =>
        get().updateDraftCylinderStock({ brandId, cylinderId, change: -1 }),
      
      // 🔵 set specific stock to a cylinder by id
      setDraftCylinderStock: ({ brandId, cylinderId, newStock }) => {
        set((state) => {
          const updatedDraft = state.draftSelectedBrands.map((brand) => {
            if (brand.id !== brandId) return brand;

            const updatedCylinders = brand.cylinders.map((cyl) => {
              if (cyl.id !== cylinderId) return cyl;
              return { ...cyl, stock: Math.max(0, Number(newStock)) };
            });

            // Calculate total stock of all cylinders for this brand
            const totalCylinderCount = updatedCylinders.reduce(
              (sum, cyl) => sum + (typeof cyl.stock === "number" ? cyl.stock : 0),
              0
            );

            return { ...brand, cylinders: updatedCylinders, totalCylinderCount };
          });


          return { draftSelectedBrands: updatedDraft };
        });
      },

      // 🔴 set new price for a specific cylinder
      setDraftCylinderPrice: ({ brandId, cylinderId, newPrice }) => {
        set((state) => {
          const updatedDraft = state.draftSelectedBrands.map((brand) => {
            if (brand.id !== brandId) return brand;

            const updatedCylinders = brand.cylinders.map((cyl) => {
              if (cyl.id !== cylinderId) return cyl;
              return { ...cyl, price: newPrice };
            });

            // Calculate total stock of all cylinders for this brand
            const totalCylinderCount = updatedCylinders.reduce(
              (sum, cyl) => sum + (typeof cyl.stock === "number" ? cyl.stock : 0),
              0
            );

            return { ...brand, cylinders: updatedCylinders, totalCylinderCount };
          });

          return { draftSelectedBrands: updatedDraft };
        });
      },
    }),
    {
      name: "selected-brands-storage",
      partialize: (state) => ({
        selectedBrands: state.selectedBrands,
      }),
    }
  )
);
