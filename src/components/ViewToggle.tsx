import ListAltSharpIcon from "@mui/icons-material/ListAltSharp";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";

interface ViewToggleProps {
  viewMode: "grid" | "list";
  onToggle: (mode: "grid" | "list") => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onToggle,
}) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => {
          onToggle("grid");
        }}
        className={`p-1 rounded ${
          viewMode === "grid" ? " bg-blue-50 text-[#195183]" : "text-gray-400"
        }`}
        aria-label="Grid View"
      >
        <GridViewOutlinedIcon />
      </button>
      <button
        onClick={() => onToggle("list")}
        className={`p-1 rounded ${
          viewMode === "list" ? "bg-blue-50 text-[#195183]" : "text-gray-400"
        }`}
        aria-label="List View"
      >
        <ListAltSharpIcon />
      </button>
    </div>
  );
};
