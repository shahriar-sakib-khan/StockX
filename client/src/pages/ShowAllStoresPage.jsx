import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectCoverflow, Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

import { getAllStores } from "../features/authentication/services/authServices";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

export default function ShowAllStores() {
    const [stores, setStores] = useState([]);
    const setCurrentStore = useAuthStore((state) => state.setCurrentStore);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const res = await getAllStores();
                setStores(res.stores || []);
            } catch (err) {
                console.error("Failed to fetch stores:", err);
            }
        };
        fetchStores();
    }, []);

    const handleSelectStore = (store) => {
        setCurrentStore(store);
        navigate("/dashboard");
    };

    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center bg-gray-100 p-8">
            <h1 className="mb-8 text-3xl font-bold">Select a Store</h1>

            <Swiper
                modules={[Navigation, EffectCoverflow, Mousewheel]}
                effect="coverflow"
                grabCursor
                centeredSlides
                slidesPerView={3}
                spaceBetween={40}
                mousewheel={{ sensitivity: 0.5 }}
                navigation
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false,
                }}
                className="w-full max-w-5xl mb-8"
            >
                {stores.map((store) => (
                    <SwiperSlide
                        key={store.id}
                        className="flex cursor-pointer items-center justify-center"
                        onClick={() => handleSelectStore(store)}
                    >
                        <div className="flex h-[200px] w-[300px] items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold text-white shadow-lg">
                            {store.name}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                onClick={() => navigate("/addStore")}
                className="mt-4 rounded-xl bg-blue-500 px-6 py-3 text-xl font-semibold text-white hover:bg-green-600 transition"
            >
                Add Store
            </button>
        </div>
    );
}
