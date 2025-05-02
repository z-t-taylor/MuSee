import { Link } from "react-router-dom";
import logo from "../assets/logo-2-cropped.svg";
import { BackButton } from "./BackButton";

export const Header = () => {
  return (
    <header className="relative border-b flex items-center justify-center p-4">
      <div className="absolute left-4">
        <BackButton fallbackTo="/" />
      </div>
      <Link to="/">
        <img src={logo} alt="MuSee logo" className="w-[150px] mx-auto" />
      </Link>
    </header>
  );
};
