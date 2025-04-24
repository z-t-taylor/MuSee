import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <div>
      <header>
        <div>
          <Link to="/">
            <p>MuSee</p>
          </Link>{" "}
          {/*placeholder for logo*/}
        </div>
      </header>
    </div>
  );
};
