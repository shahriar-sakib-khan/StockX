import OptionCard from "./OptionCard";
import images from "../../../assets/nav_icons/Images";
import { Section } from "../utils/Section";
import { heading } from "../utils/Heading";

export default function OptionsSection() {
  return (
    <Section>
      {heading("Options")}
      <div className="mr-4 grid w-full grid-cols-[repeat(auto-fit,_minmax(200px,_1fr))] gap-4 overflow-hidden">
        {/* <OptionCard
        path="./selection"
        imgSrc={images.img_selection}
        title="Selection"
      /> */}
        <OptionCard path="./buy" imgSrc={images.img_buy} title="Buy" />
        <OptionCard
          path="./shop-selection"
          imgSrc={images.img_sell}
          title="Sell"
        />
        <OptionCard path="#" imgSrc={images.img_due} title="Due" />
        {/* <OptionCard
          path="./inventory"
          imgSrc={images.img_inventory}
          title="Inventory"
        /> */}
        {/* <OptionCard path="./shop" imgSrc={images.img_shop} title="Shop" /> */}
        <OptionCard
          path="./vehicle-cost"
          imgSrc={images.img_vehicles}
          title="Vehicle Cost"
        />
        {/* <OptionCard
          path="./exchange-history"
          imgSrc={images.img_history}
          title="History"
        /> */}
        {/* <OptionCard
          path="./daily-sales"
          imgSrc={images.img_dailySales}
          title="Daily Sales"
        /> */}
        {/* <OptionCard
          path="./profile"
          imgSrc={images.img_profile}
          title="Profile"
        /> */}
        {/* <OptionCard
          path="./community"
          imgSrc={images.img_community}
          title="Community"
        /> */}
        {/* <OptionCard path="/" imgSrc={images.img_logout} title="Log out" /> */}
      </div>
    </Section>
  );
}
