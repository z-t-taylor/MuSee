import { NavLink } from "react-router-dom";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

export const Sidebar = () => {
  const linkClass =
    "flex items-center gap-3 px-4 py-2 hover:bg-gray-100 rounded transition-colors";

  const iconBase = "transition-colors";
  const iconColor = "text-[#0A3D91]";
  const iconHover = "group-hover:text-[#0C49B8]";
  const iconActive = "text-[#0C49B8]";

  return (
    <aside className="w-64 h-full fixed left-0 top-0 bg-white shadow-md p-4">
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
              <h2>My Exhibitions</h2>
            </>
          )}
        </NavLink>
      </nav>
    </aside>
  );
};
