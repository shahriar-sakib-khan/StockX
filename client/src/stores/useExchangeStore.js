import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { nanoid } from "nanoid";
import { toast } from "sonner";

/**
 * Exchange Store
 * Manages two lists:
 *  - give: items being given out
 *  - take: items being taken in
 *
 * Each item keeps flattened fields + full cylinder object so UI is consistent.
 */

export const useExchangeStore = create(
    devtools((set, get) => ({
        give: [],
        take: [],

        /**
         * normalizePayload(type, raw)
         * Convert a raw payload from UI/modals into the canonical item shape
         * Exposed so UI can call it before passing to addItem/updateItem.
         */
        normalizePayload: (type, raw = {}) => {
            const cylinder = raw.cylinder ?? null;

            const quantity = Number(raw.quantity ?? raw.qty ?? 0) || 0;

            const unitPrice = Number(
                cylinder?.price ?? raw.price ?? raw.unitPrice ?? 0,
            );

            const computedTotal =
                Number(
                    raw.computedTotal ??
                        (raw.quantity !== undefined
                            ? raw.quantity * unitPrice
                            : quantity * unitPrice),
                ) || 0;

            const total = Number(raw.total ?? computedTotal) || computedTotal;

            return {
                // do not force uid here — addItem will assign if missing
                uid: raw.uid ?? null,
                cylinder,
                id: cylinder?.id ?? raw.cylinderId ?? raw.id ?? null,

                brand:
                    cylinder?.brandName ??
                    raw.brand?.name ??
                    raw.brandName ??
                    raw.brand ??
                    "",

                brandId:
                    raw.brand?.id ?? raw.brandId ?? cylinder?.brandId ?? null,

                size: cylinder?.size ?? raw.size ?? "",
                regulatorType:
                    cylinder?.regulatorType ?? raw.regulatorType ?? "",

                quantity,
                price: Number(unitPrice) || 0,
                computedTotal,
                total: Number(total) || 0,
            };
        },

        /**
         * Add item to "give" or "take"
         *
         * Returns: { duplicate: boolean, existing?: item, item?: item }
         */
        addItem: (type, item = {}) => {
            // Use get() to inspect current state synchronously
            const state = get();
            const list = [...(state[type] || [])];

            // Normalize incoming payload (but keep uid null so we generate unique)
            const normalizedIncoming = get().normalizePayload(type, item);

            const incomingCylinder = normalizedIncoming.cylinder ?? null;

            // ---------------------------
            // DEDUPLICATION CHECK
            // match: brand + size + regulatorType
            // ---------------------------
            const duplicate = list.find((it) => {
                return (
                    (it.brand ?? "").toString().toLowerCase() ===
                        (
                            incomingCylinder?.brandName ??
                            item.brand?.name ??
                            item.brand ??
                            ""
                        )
                            .toString()
                            .toLowerCase() &&
                    String(it.size) ===
                        String(incomingCylinder?.size ?? item.size ?? "") &&
                    String(it.regulatorType) ===
                        String(
                            incomingCylinder?.regulatorType ??
                                item.regulatorType ??
                                "",
                        )
                );
            });

            if (duplicate) {
                // user feedback
                toast.error(
                    "Cylinder already selected. Editing existing item…",
                );

                // return marker so caller can open edit modal if desired
                return { duplicate: true, existing: duplicate };
            }
            // ---------------------------
            // END DEDUP
            // ---------------------------

            // ensure uid
            const uid = nanoid();

            // Build final normalized item (respect previously normalized values)
            const final = {
                ...normalizedIncoming,
                uid,
            };

            // push and update state
            set((s) => {
                const next = [...(s[type] || []), final];
                return { ...s, [type]: next };
            });

            return { duplicate: false, item: final };
        },

        /**
         * Update an item by uid
         */
        updateItem: (type, uid, updates = {}) =>
            set((state) => {
                const list = (state[type] || []).map((it) => {
                    if (it.uid !== uid) return it;

                    // 1) cylinder
                    const cylinder = updates.cylinder ?? it.cylinder ?? null;

                    // 2) quantity (safe numeric)
                    const quantity =
                        updates.quantity !== undefined
                            ? Number(updates.quantity)
                            : Number(it.quantity);

                    // 3) price (safe numeric)
                    const price =
                        updates.price !== undefined
                            ? Number(updates.price)
                            : Number(cylinder?.price ?? it.price ?? 0);

                    // 4) computed total (safe)
                    const computed =
                        updates.computedTotal !== undefined
                            ? Number(updates.computedTotal)
                            : Number(quantity * price);

                    // 5) final total
                    const total =
                        updates.total !== undefined
                            ? Number(updates.total)
                            : computed;

                    // Correct merge order: computed values FIRST,
                    // user overrides LAST for predictable UI behavior
                    return {
                        ...it,
                        cylinder,
                        quantity,
                        price,
                        total,
                        computedTotal: computed,
                        ...updates,
                    };
                });

                return { ...state, [type]: list };
            }),

        /**
         * Remove item by uid
         */
        removeItem: (type, uid) =>
            set((state) => ({
                ...state,
                [type]: (state[type] || []).filter((i) => i.uid !== uid),
            })),

        /**
         * Reset both lists
         */
        reset: () => set({ give: [], take: [] }),

        /**
         * Summary totals
         */

        getTotals: () => {
            const s = get();
            const sumQuantity = (arr) =>
                arr.reduce((acc, it) => acc + (Number(it.quantity) || 0), 0);

            return {
                giveCount: sumQuantity(s.give), // total quantity of all give items
                takeCount: sumQuantity(s.take), // total quantity of all take items
                giveTotal: s.give.reduce(
                    (acc, it) => acc + (Number(it.price) || 0),
                    0,
                ), // total amount of all give items
                takeTotal: s.take.reduce(
                    (acc, it) => acc + (Number(it.price) || 0),
                    0,
                ), // total amount of all take items
            };
        },

        /**
         * Build backend payload
         */
        buildPayload: (shopId, extra = {}) => {
            const s = get();

            const normalizeReg = (reg) =>
                String(reg).includes("mm") ? String(reg) - "mm" : String(reg);

            return {
                shopId,
                cylinders: {
                    give: s.give.map((it) => ({
                        id: it.id,
                        brand: it.brand,
                        size: Number(it.size) || 0,
                        regulatorType: normalizeReg(it.regulatorType || ""),
                        quantity: Number(it.quantity) || 0,
                        price: Number(it.price) || 0,
                        amount: Number(it.total) || 0,
                    })),
                    take: s.take.map((it) => ({
                        id: it.id,
                        brand: it.brand,
                        size: Number(it.size) || 0,
                        regulatorType: normalizeReg(it.regulatorType || ""),
                        quantity: Number(it.quantity) || 0,
                    })),
                },
                totalAmount: s.give.reduce(
                    (acc, it) => acc + (Number(it.total) || 0),
                    0,
                ),
                totalPrice: s.give.reduce(
                    (acc, it) => acc + (Number(it.computedTotal) || 0),
                    0,
                ),
                ...extra,
            };
        },
    })),
);
