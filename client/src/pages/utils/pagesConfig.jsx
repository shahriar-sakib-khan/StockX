import { LuLayoutDashboard as DashboardIcon } from "react-icons/lu";
import { MdOutlineInventory2 as InventoryIcon } from "react-icons/md";
import { AiOutlineShop as ShopIcon } from "react-icons/ai";
import { HiOutlineTruck as VehicleIcon } from "react-icons/hi2";
import { FaRegClock as HistoryIcon } from "react-icons/fa";
import { CgProfile as ProfileIcon } from "react-icons/cg";
import { MdOutlineSettings as SettingsIcon } from "react-icons/md";
import { HiOutlineUserGroup as MembersIcon } from "react-icons/hi2";

export const pagesConfig = {
  "/profile": { title: "Profile", icon: ProfileIcon },
  "/dashboard": { title: "Dashboard", icon: DashboardIcon },
  "/inventory": { title: "Inventory", icon: InventoryIcon },
  "/shops": { title: "Shops", icon: ShopIcon },
  "/vehicles": { title: "Vehicles", icon: VehicleIcon },
  "/history": { title: "History", icon: HistoryIcon },
  "/settings": { title: "Settings", icon: SettingsIcon },
  "/members": { title: "Members", icon: MembersIcon },
};
