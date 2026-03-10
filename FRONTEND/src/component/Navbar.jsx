import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  // ✅ Check login from your userAuth object
  useEffect(() => {
    const userAuth = localStorage.getItem("userAuth");

    if (userAuth) {
      const parsed = JSON.parse(userAuth);
      setIsLoggedIn(parsed?.isLogin);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // ✅ Correct logout for your system
  const handleLogout = () => {
    localStorage.removeItem("userAuth");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 shadow-md border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* LOGO */}
          <h1
            className="text-2xl font-bold text-gray-800 cursor-pointer"
            onClick={() => navigate("/")}
          >
            📚 BookStore
          </h1>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
            <NavLink to="/" className="hover:text-black">
              Home
            </NavLink>

            <NavLink to="/about" className="hover:text-black">
              About
            </NavLink>

            <NavLink to="/contact" className="hover:text-black">
              Contact
            </NavLink>

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="bg-black text-white px-4 py-2 rounded-xl hover:scale-105 transition"
              >
                Login
              </button>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        className={`md:hidden transition-all duration-500 overflow-hidden ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-md px-6 pb-6 space-y-4 shadow-lg">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="block hover:text-black"
          >
            Home
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block hover:text-black"
          >
            About
          </NavLink>

          <NavLink
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block hover:text-black"
          >
            Contact
          </NavLink>

          {isLoggedIn ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="w-full bg-black text-white py-2 rounded-xl"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="w-full bg-black text-white py-2 rounded-xl"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
