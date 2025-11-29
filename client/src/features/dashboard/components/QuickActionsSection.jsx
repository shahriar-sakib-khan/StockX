import QuickActionCard from "./QuickActionCard";
import images from "@/assets/nav_icons/Images";
import { DashboardCard } from "./DashboardWidgets";
import { FaBolt } from "react-icons/fa";

export default function QuickActionsSection() {
    return (
        <DashboardCard title="Quick Actions" icon={FaBolt} className="h-full">
            {/* Mobile: 2 Columns
                Tablet: 4 Columns
                Desktop: 4 Columns
            */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <QuickActionCard
                    path="/buy"
                    imgSrc={images.img_buy}
                    title="Buy Entry"
                />
                <QuickActionCard
                    path="/shops/selection"
                    imgSrc={images.img_sell}
                    title="Sell Entry"
                />
                <QuickActionCard
                    path="/dues"
                    imgSrc={images.img_due}
                    title="Manage Dues"
                />
                <QuickActionCard
                    path="/vehicles/cost"
                    imgSrc={images.img_vehicles}
                    title="Vehicle Cost"
                />
            </div>
        </DashboardCard>
    );
}
