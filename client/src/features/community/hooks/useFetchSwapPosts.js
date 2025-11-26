// src/features/community/hooks/useFetchSwapPosts.js
import { useQuery } from "@tanstack/react-query";
// import { fetchSwapPosts } from "../services/swap";

export function useFetchSwapPosts(storeId) {
    return useQuery({
        queryKey: ["swapPosts", storeId],
        // queryFn: () => fetchSwapPosts(storeId),
        // enabled: !!storeId,

        queryFn: async () => {
            // ---------- DEMO FEED ----------
            return [
                {
                    id: "p101",
                    postType: "give",
                    storeName: "CTG Gas Point",
                    storeOwnerName: "Hasan Ali",
                    phone: "01712345678",
                    storeImage: "stores/ctg1.png",
                    offer: [
                        {
                            brand: "Bashundhara",
                            size: 12,
                            regulatorType: "22mm",
                            quantity: 4,
                        },
                    ],
                    take: [],
                    likes: 12,
                    comments: 3,
                    createdAt: "2025-01-10T10:20:00Z",
                },
                {
                    id: "p102",
                    postType: "take",
                    storeName: "Amin Enterprise",
                    phone: "01898765432",
                    offer: [],
                    take: [
                        {
                            brand: "Omera",
                            size: 12,
                            regulatorType: "22mm",
                            quantity: 2,
                        },
                        {
                            brand: "Jamal",
                            size: 5,
                            regulatorType: "22mm",
                            quantity: 3,
                        },
                    ],
                    likes: 4,
                    comments: 1,
                    createdAt: "2025-01-11T09:00:00Z",
                },
                {
                    id: "p103",
                    postType: "both",
                    storeName: "Gas Depot BD",
                    phone: "01234567890",
                    offer: [
                        {
                            brand: "Jamal",
                            size: 12,
                            regulatorType: "22mm",
                            quantity: 1,
                        },
                    ],
                    take: [
                        {
                            brand: "Bashundhara",
                            size: 12,
                            regulatorType: "22mm",
                            quantity: 1,
                        },
                    ],
                    likes: 22,
                    comments: 7,
                    createdAt: "2025-01-12T14:00:00Z",
                },
            ];
        },
    });
}
