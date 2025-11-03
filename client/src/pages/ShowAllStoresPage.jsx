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
                setStores(res.data.stores || []);
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
                spaceBetween={40} // spacing between slides
                mousewheel={{ sensitivity: 0.5 }}
                navigation
                slideToClickedSlide={true}
                preventClicks={false}
                preventClicksPropagation={false}
                touchStartPreventDefault={false}
                coverflowEffect={{
                    rotate: 0,
                    stretch: 0,
                    depth: 200,
                    modifier: 1,
                    slideShadows: false,
                }}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 20 }, // mobile
                    640: { slidesPerView: 2, spaceBetween: 30 }, // tablet
                    1024: { slidesPerView: 3, spaceBetween: 40 }, // desktop
                }}
                className="mb-8 w-full max-w-5xl"
            >
                {stores.map((store) => (
                    <SwiperSlide
                        key={store.id}
                        className="flex items-center justify-center"
                        style={{ width: "300px" }} // ensures proper width for click
                    >
                        <div
                            onClick={() => handleSelectStore(store)}
                            className="flex h-[200px] w-full cursor-pointer items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105"
                            style={{ pointerEvents: "auto" }}
                        >
                            {store.name}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <button
                onClick={() => navigate("/addStore")}
                className="mt-4 rounded-xl bg-blue-500 px-6 py-3 text-xl font-semibold text-white transition hover:bg-green-600"
            >
                Add Store
            </button>
        </div>
    );
}
