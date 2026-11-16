
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="nav-logo">
        Our Memories <span>♥</span>
      </Link>

      <nav className="nav-menu">
        <NavLink to="/" end>
          Home
        </NavLink>

        <NavLink to="/memories/our-story">
          Our Story
        </NavLink>

        <NavLink to="/albums">
          Gallery
        </NavLink>
      </nav>
    </header>
  );
}
