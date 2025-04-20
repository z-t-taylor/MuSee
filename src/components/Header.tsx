import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div>
      <header>
        <div>
          <p>MuSee</p> {/*placeholder for logo*/}
        </div>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/exhibitions">My Exhibitions</Link>
        </nav>
      </header>
    </div>
  );
};
