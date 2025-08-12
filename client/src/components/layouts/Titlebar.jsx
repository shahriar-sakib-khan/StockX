import { useLocation } from "react-router-dom";
import { pagesConfig } from "../../pages/utils/pagesConfig";

export default function Titlebar() {
  const location = useLocation();
  const config = pagesConfig[location.pathname];

  const title = config?.title || "Untitled Page";
  const PageIconComponent = config?.icon;

  return (
    <section className="pointer-events-none flex h-[var(--titlebar-height)] items-center border-b border-gray-300 text-gray-600">
      {PageIconComponent && <PageIconComponent className="mr-1 ml-4 text-lg" />}
      {title}
    </section>
  );
}
