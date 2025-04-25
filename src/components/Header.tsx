import { Link } from "react-router-dom";
import logo from "../assets/logo2.svg";

export const Header = () => {
  return (
    <header className="border-b-2 flex justify-center pl-1">
      <div>
        <Link to="/">
          <img src={logo} alt="Musee logo" className="w-[100px]" />
        </Link>{" "}
      </div>
    </header>
  );
};
