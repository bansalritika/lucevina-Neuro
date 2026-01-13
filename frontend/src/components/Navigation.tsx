import { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Search, User, ShoppingBag, X } from "lucide-react";
import sleepingMask from "../assets/sleepingmask.jpg";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getCart } from "@/lib/cart";
import logoblack from "../assets/logoblack.png";
import { motion, AnimatePresence } from "framer-motion";

const DropdownSection = ({ title, categories, onClickClose }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex justify-between items-center text-left font-medium text-foreground/80 text-sm hover:text-[#C1A75D] transition-colors"
      >
        {title}
        <span
          className={`transition-transform duration-300 ${
            open ? "rotate-90 text-[#C1A75D]" : ""
          }`}
        >
          &gt;
        </span>
      </button>

      {open && (
        <ul className="ml-3 mt-2 space-y-1 text-sm">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat._id}>
                <Link
                  to={`/ourproducts/${cat.title}`}
                  onClick={onClickClose}
                  className="hover:text-[#C1A75D] transition-colors flex items-center gap-2"
                >
                  {title === "By Emotion" && (
                    <span
                      className="w-2 h-2 rounded-full inline-block"
                      style={{
                        backgroundColor: `hsl(${Math.random() * 360}, 70%, 80%)`,
                      }}
                    ></span>
                  )}
                  {cat.title}
                </Link>
              </li>
            ))
          ) : (
            <li className="italic text-muted-foreground">No categories</li>
          )}
        </ul>
      )}
    </div>
  );
};


const Navigation = ({ isBannerVisible }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isHoveringButton, setIsHoveringButton] = useState(false);
  const [isHoveringMenu, setIsHoveringMenu] = useState(false);
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [prevScroll, setPrevScroll] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const navRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const showMegaMenu = isHoveringButton || isHoveringMenu;

  const handleSearch = (e) => {
  e.preventDefault();
  if (searchTerm.trim()) {
    navigate(`/ourproducts?search=${encodeURIComponent(searchTerm)}`);
    setSearchTerm("");
    setSearchOpen(false);
  }
};

  // 🧭 Hide/show navbar on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isHoveringNav || isHoveringMenu || isHoveringButton) return;
      const current = window.scrollY;
      setIsVisible(current < prevScroll || current < 10);
      setPrevScroll(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScroll, isHoveringNav, isHoveringMenu, isHoveringButton]);

  useEffect(() => {
    const navElement = navRef.current;
    if (!navElement) return;

    const handleMouseEnter = () => setIsHoveringNav(true);
    const handleMouseLeave = () => setIsHoveringNav(false);

    navElement.addEventListener("mouseenter", handleMouseEnter);
    navElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      navElement.removeEventListener("mouseenter", handleMouseEnter);
      navElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 🛒 Fetch cart
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userId = localStorage.getItem("userId");
        if (isLoggedIn && userId) {
          const cart = await getCart(userId);
          setCartItems(cart.items || []);
          setCartCount(cart.items?.length || 0);
        } else {
          setCartItems([]);
          setCartCount(0);
        }
      } catch (err) {
        console.error("❌ Failed to fetch cart:", err);
      }
    };
    fetchCart();
  }, [isLoggedIn]);

  // 📦 Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        if (Array.isArray(data)) setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const categoriesByType = {
    "By Product Type": categories.filter(
      (c) => c.categoryType === "By Product Type"
    ),
    "By Concern": categories.filter((c) => c.categoryType === "By Concern"),
    "By Emotion": categories.filter((c) => c.categoryType === "By Emotion"),
  };

  const navItems = [
    "OUR PRODUCTS",
    "FIND YOUR ROUTINE",
    "ABOUT US",
    "OUR BLOGS",
    "FIND US",
  ];

  const navLinks = {
    "OUR PRODUCTS": "/ourproducts",
    "FIND YOUR ROUTINE": "/routine",
    "ABOUT US": "/about",
    "OUR BLOGS": "/blog",
    "FIND US": "/findus",
  };

  return (
    <nav
      ref={navRef}
      className={`sticky top-0 w-full border-b border-border transition-transform duration-300 z-50 ${ scrollY < 50
      ? "bg-transparent hover:bg-background"
      : "bg-background"
      } ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${isBannerVisible ? "mt-0" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* === Desktop Navbar === */}
        <div className="hidden xl:flex h-16 items-center justify-between">
          {/* Logo */}
            <div className="w-32">
              <Link to="/">
            <img src={logoblack} alt="Lucevina Logo" className="w-auto h-14 tracking-[0.2em]"/></Link>
            </div>
          {/* Desktop Nav */}
          <div className="relative">
            <div className="ml-10 flex items-baseline relative">
              {navItems.map((item) => (
                <Link key={item} to={navLinks[item] || "/"}>
                  <div
                    className="relative cursor-pointer px-4 py-5 group"
                    onMouseEnter={() =>
                      item === "OUR PRODUCTS" && setIsHoveringButton(true)
                    }
                    onMouseLeave={() => setIsHoveringButton(false)}
                  >
                    <div className="relative inline-block">
                      <button
                        className={`text-xs font-medium tracking-wide transition-colors duration-300 ${
                          showMegaMenu && item === "OUR PRODUCTS"
                            ? "text-[#C1A75D]"
                            : "text-foreground/80 hover:text-[#C1A75D]"
                        }`}
                      >
                        {item}
                      </button>
                      <span
                        className={`absolute left-0 bottom-0 h-[1.5px] bg-[#C1A75D] transition-all duration-300 ${
                          showMegaMenu && item === "OUR PRODUCTS"
                            ? "w-full"
                            : "w-0 group-hover:w-full"
                        }`}
                      ></span>
                    </div>
                  </div>
                </Link>
              ))}


              {/* ✅ Mega Menu */}
              {showMegaMenu && (
                <div
                  className="fixed left-0 top-full w-full bg-background border-t border-border shadow-lg py-10 transition-all duration-300 z-40"
                  onMouseEnter={() => setIsHoveringMenu(true)}
                  onMouseLeave={() => setIsHoveringMenu(false)}
                >
                  <div className="max-w-[1400px] mx-auto grid grid-cols-4 gap-12 px-16 text-sm">
                    {/* By Product Type */}
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground/80">
                        BY PRODUCT TYPE
                      </h3>
                      <ul className="space-y-1">
                        {categoriesByType["By Product Type"].length > 0 ? (
                          categoriesByType["By Product Type"].map((cat) => (
                            <li
                              key={cat._id}
                              className="hover:text-[#C1A75D] cursor-pointer"
                            >
                              <Link to={`/ourproducts/${cat.title}`}>
                                {cat.title}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground italic">
                            No categories yet
                          </li>
                        )}
                        <li className="text-[#C1A75D] cursor-pointer">
                          <Link to="/ourproducts">
                          See all products
                          </Link>
                        </li>
                      </ul>
                    </div>

                    {/* By Concern */}
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground/80">
                        BY CONCERN
                      </h3>
                      <ul className="space-y-1">
                        {categoriesByType["By Concern"].length > 0 ? (
                          categoriesByType["By Concern"].map((cat) => (
                            <li
                              key={cat._id}
                              className="hover:text-[#C1A75D] cursor-pointer"
                            >
                              <Link to={`/ourproducts/${cat.title}`}>
                                {cat.title}
                              </Link>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground italic">
                            No categories yet
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* By Emotion */}
                    <div>
                      <h3 className="font-semibold mb-2 text-foreground/80">
                        BY EMOTION
                      </h3>
                      <ul className="space-y-1">
                        {categoriesByType["By Emotion"].length > 0 ? (
                          categoriesByType["By Emotion"].map((cat) => (
                            <li
                              key={cat._id}
                              className="flex items-center gap-2 hover:text-[#C1A75D] cursor-pointer transition-colors"
                            >
                              <span
                                className="w-2 h-2 rounded-full inline-block"
                                style={{
                                  backgroundColor: `hsl(${
                                    Math.random() * 360
                                  }, 70%, 80%)`,
                                }}
                              ></span>
                              <span>
                                <Link to={`/ourproducts/${cat.title}`}>
                                  {cat.title}
                                </Link>
                              </span>
                            </li>
                          ))
                        ) : (
                          <li className="text-muted-foreground italic">
                            No categories yet
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Image */}
                    <div className="relative">
                      <img
                        src={sleepingMask}
                        alt="Sleeping Mask"
                        className="rounded-lg object-cover w-full h-48"
                      />
                      <p className="mt-2 text-sm hover:text-[#C1A75D] cursor-pointer">
                        The harmonie Sleeping Mask &gt;
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Icons (Desktop) */}
          <div className="flex items-center space-x-4">
            {/* 🔍 Search Toggle Button + Animated Search Bar */}
<div className="relative flex items-center">
  <button
    onClick={() => setSearchOpen(!searchOpen)}
    className="p-2 rounded-full hover:text-[#C1A75D] transition-colors"
  >
    {searchOpen ? (
      <X className="h-4 w-4 hover:text-[#C1A75D] transition-color" />
    ) : (
      <Search className="h-4 w-4 hover:text-[#C1A75D] transition-color" />
    )}
  </button>

  <AnimatePresence>
    {searchOpen && (
      <motion.form
        onSubmit={handleSearch}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: "14rem", opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden ml-2"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-3.5 w-3.5" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 pr-4 py-1 rounded-3xl border focus:ring-1 focus:ring-[#C1A75D] w-full text-sm"
          />
        </div>
      </motion.form>
    )}
  </AnimatePresence>
</div>

            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <button className="p-2 hover:text-[#C1A75D] transition-colors">
                <User className="h-4 w-4" />
              </button>
            </Link>
            <Link to="/cart" className="relative">
              <button className="p-2 hover:text-[#C1A75D] transition-colors">
                <ShoppingBag className="h-4 w-4" />
              </button>
              {isLoggedIn && cartCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>
        </div>

        {/* === Mobile Navbar === */}
        <div className="xl:hidden flex h-16 items-center justify-between">
          {/* Left Icons */}
          <div className="flex items-center gap-2">
            <Link to={isLoggedIn ? "/profile" : "/login"}>
              <button className="p-2 hover:text-[#C1A75D] transition-colors">
                <User className="h-5 w-5" />
              </button>
            </Link>
            <Link to="/cart" className="relative">
              <button className="p-2 hover:text-[#C1A75D] transition-colors">
                <ShoppingBag className="h-5 w-5" />
              </button>
              {isLoggedIn && cartCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </div>

          {/* Center Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <img src={logoblack} alt="Lucevina Logo" className="w-auto h-14 tracking-[0.2em]"/>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <div className="relative">
  <button
    onClick={() => setSearchOpen(!searchOpen)}
    className="p-2 hover:text-[#C1A75D] transition-colors"
  >
    {searchOpen ? (
      <X className="h-5 w-5 text-foreground" />
    ) : (
      <Search className="h-5 w-5 text-foreground" />
    )}
  </button>

  <AnimatePresence>
    {searchOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute right-0 top-full mt-4 bg-background border border-border rounded-2xl shadow-md p-3 w-64"
      >
        <form onSubmit={handleSearch}>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-3 pr-4 py-2 text-sm"
          />
        </form>
      </motion.div>
    )}
  </AnimatePresence>
</div>
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <button className="p-2 hover:text-[#C1A75D] transition-colors">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background overflow-y-auto">
                <div className="flex flex-col space-y-4 mt-8">

                  {navItems.map((item) => {
                    if (item === "OUR PRODUCTS") {
                      return (
                        <div key={item}>
                          <button
                            onClick={() =>
                              setIsHoveringButton((prev) => !prev) // toggle open/close
                            }
                            className="w-full text-left text-sm font-medium tracking-wide hover:text-[#C1A75D] transition-colors flex justify-between items-center"
                          >
                            {item}
                            <span
                              className={`transition-transform duration-300 ${
                                isHoveringButton ? "rotate-90" : ""
                              }`}
                            >
                              &gt;
                            </span>
                          </button>

                          {/* Sub-menu for OUR PRODUCTS */}
                          {isHoveringButton && (
          <div className="ml-4 mt-2 space-y-4 text-sm">
            {/* 🧠 Reusable dropdowns */}
            <DropdownSection
              title="By Product Type"
              categories={categoriesByType["By Product Type"]}
              onClickClose={() => setIsOpen(false)}
            />
            <DropdownSection
              title="By Concern"
              categories={categoriesByType["By Concern"]}
              onClickClose={() => setIsOpen(false)}
            />
            <DropdownSection
              title="By Emotion"
              categories={categoriesByType["By Emotion"]}
              onClickClose={() => setIsOpen(false)}
            />

            <Link
              to="/ourproducts"
              onClick={() => setIsOpen(false)}
              className="text-[#C1A75D] block mt-3"
            >
              See all products &gt;
            </Link>
          </div>
        )}
                        </div>
                      );
                    }

                    // Default for other nav items
                    return (
                      <Link
                        key={item}
                        to={navLinks[item] || "/"}
                        onClick={() => setIsOpen(false)}
                      >
                        <div className="text-sm font-medium tracking-wide text-left hover:text-[#C1A75D] transition-colors">
                          {item}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>

            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
