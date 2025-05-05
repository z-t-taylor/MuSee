import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

export const Sidebar = () => {
  return (
    <aside className="h-full bg-white shadow-md">
      <nav className="flex h-full flex-row md:flex-col justify-around md:justify-start items-center md:items-start p-2 md:p-4 pt-0 md:pt-6 gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `p-2 w-auto md:w-full rounded-xl md:rounded transition-colors ${
              isActive
                ? "bg-[#195183] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <HomeOutlinedIcon fontSize="medium" />
          <span className="hidden md:inline ml-2">Home</span>
        </NavLink>

        <NavLink
          to="/exhibitions"
          className={({ isActive }) =>
            `p-2 pr-2 md:pr-5 w-auto md:w-full rounded-xl md:rounded transition-colors ${
              isActive
                ? "bg-[#195183] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <CollectionsOutlinedIcon fontSize="medium" />
          <span className="hidden md:inline ml-2">Exhibitions</span>
        </NavLink>
      </nav>
    </aside>
  );
};
