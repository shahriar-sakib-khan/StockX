import { Section } from "../utils/Section";
import { Heading } from "../utils/Heading";
import { NavLink } from "react-router-dom";
import {CylinderTable} from "@/features";

export default function InventoryOverviewSection() {
    return (
        <div className="bg-gray-100 py-2">
            <Section>
                <Heading>Inventory Overview</Heading>{" "}
                <CylinderTable overview={true} brandCount={3} />
                <NavLink to="/inventory" className="text-center text-blue-500">
                    View More
                </NavLink>
            </Section>
        </div>
    );
}
