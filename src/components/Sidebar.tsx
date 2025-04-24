import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

export const Sidebar = () => {
  const linkClass =
    "flex flex-col items-center gap-1 px-4 py-2 hover:bg-gray-100 rounded transition-colors text-sm";

  const iconBase = "transition-colors";
  const iconColor = "text-[#0A3D91]";
  const iconHover = "group-hover:text-[#0C49B8]";
  const iconActive = "text-[#0C49B8]";

  return (
    <aside className="w-59 h-full bg-white shadow-md p-2 pl-6 pt-4 flex flex-col justify-start">
      <nav className="flex flex-col gap-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `group ${linkClass} ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <HomeOutlinedIcon
                className={`${iconBase} ${iconColor} ${iconHover} ${
                  isActive ? iconActive : ""
                }`}
              />
              <h2>Home</h2>
            </>
          )}
        </NavLink>

        <NavLink
          to="/exhibitions"
          className={({ isActive }) =>
            `group ${linkClass} ${isActive ? "bg-gray-200 font-semibold" : ""}`
          }
        >
          {({ isActive }) => (
            <>
              <CollectionsOutlinedIcon
                className={`${iconBase} ${iconColor} ${iconHover} ${
                  isActive ? iconActive : ""
                }`}
              />
              <h2>Exhibitions</h2>
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};
