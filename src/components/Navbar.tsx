import { NavLink } from "react-router-dom";
import { cn } from "cn";

const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        "text-sm font-medium",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
    );

const Navbar = () => {
    return (
        <nav className="flex items-center gap-4 border-b p-4">
            <span className="mr-auto text-lg font-bold">Book Finder</span>
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            <NavLink to="/favorites" className={linkClass}>Favorites</NavLink>
        </nav>
    );
}

export default Navbar
