import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

export const BackButton: React.FC<{ fallbackTo?: string }> = ({
  fallbackTo = "/",
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const hiddenPaths = [fallbackTo, "/exhibitions"];

  if (hiddenPaths.includes(pathname)) {
    return null;
  }

  const handleClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate(fallbackTo, { replace: true });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center px-4 pt-1 text-gray-400 md:hover:text-[#195183] rounded"
    >
      <ChevronLeftIcon className="text-sm " />
      <span className="ml-1 text-sm ">Back</span>
    </button>
  );
};
