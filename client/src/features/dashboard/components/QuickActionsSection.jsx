import QuickActionCard from "./QuickActionCard";
import images from "../../../assets/nav_icons/Images";
import { Section } from "../utils/Section";
import { Heading } from "../utils/Heading";

export default function QuickActionsSection() {
    return (
        <Section>
            <Heading>Quick Actions</Heading>
            <div className="mr-4 grid w-full grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 overflow-hidden">
                {/* <QuickActionCard
          path="./selection"
          imgSrc={images.img_selection}
          title="Selection"
        /> */}
                <QuickActionCard
                    path="./buy"
                    imgSrc={images.img_buy}
                    title="Buy"
                />
                <QuickActionCard
                    path="./shop-selection"
                    imgSrc={images.img_sell}
                    title="Sell"
                />
                <QuickActionCard path="#" imgSrc={images.img_due} title="Due" />
                {/* <QuickActionCard
            path="./inventory"
            imgSrc={images.img_inventory}
            title="Inventory"
          /> */}
                {/* <QuickActionCard path="./shop" imgSrc={images.img_shop} title="Shop" /> */}
                <QuickActionCard
                    path="./vehicle-cost"
                    imgSrc={images.img_vehicles}
                    title="Vehicle Cost"
                />
                {/* <QuickActionCard
            path="./exchange-history"
            imgSrc={images.img_history}
            title="History"
          /> */}
                {/* <QuickActionCard
            path="./daily-sales"
            imgSrc={images.img_dailySales}
            title="Daily Sales"
          /> */}
                {/* <QuickActionCard
            path="./profile"
            imgSrc={images.img_profile}
            title="Profile"
          /> */}
                {/* <QuickActionCard
            path="./community"
            imgSrc={images.img_community}
            title="Community"
          /> */}
                {/* <QuickActionCard path="/" imgSrc={images.img_logout} title="Log out" /> */}
            </div>
        </Section>
    );
}
