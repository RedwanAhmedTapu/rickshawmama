import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageProvider";
import { useState } from "react";

const Nav = () => {
  const { language, changeLanguage } = useLanguage();
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleLanguage = () => {
    const newLanguage = language === "en" ? "bn" : "en";
    changeLanguage(newLanguage);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  console.log(isMenuOpen)

  return (
    <div className={`w-full h-24 flex justify-around fixed top-4 z-50 ${isMenuOpen ? "h-screen" : ""}`}>
      
      <div className="w-44 h-24 flex justify-between items-center md:max-w-[500px] max-[1000px]:hidden">
        <div className="w-1/2 h-full flex items-center text-xl  text-white font-bold">
          <Link to="/signup">Sign Up</Link>
        </div>
        <div className="w-1/2 h-full flex items-center text-xl font-bold text-white">
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className="w-96 h-24 flex justify-between items-center md:max-w-[500px] max-[1000px]:hidden">
        <div className="w-16 h-full flex items-center text-xl font-bold text-[#F8A339] uppercase">
          <Link to="/">HOME</Link>
        </div>

        <button onClick={toggleLanguage} className="text-white">
          {language === "en" ? "Switch to Bengali" : "Switch to English"}
        </button>

        <div className="w-16 h-full flex items-center text-xl font-normal text-white uppercase">
          Contact
        </div>
      </div>

      {/* Menu Icon */}
      <div
        className="cursor-pointer w-8 h-8 flex items-center justify-center text-white absolute top-4 right-4 md:hidden "
        style={{ zIndex: 100 }}
       
      >
        <div className={`menu-icon ${isMenuOpen ? "menu-open" : ""}`}  onClick={toggleMenu}></div>
      </div>

      {/* Menu Content */}
      <div className={` ${isMenuOpen ? "w-full h-screen transition-all duration-1000 absolute top-12 bg-[#000] opacity-80 z-50 filter brightness-200 flex-col justify-center items-center min-[760px]:hidden " : "h-0"}`}>

      <div className={`${isMenuOpen ? "w-full  h-32 flex flex-col justify-center items-center p-2 gap-y-1  filter brightness-200" : "hidden"}`}>
        <div className="w-full h-full flex_center text-xl  text-white filter brightness-200 font-bold" onClick={toggleMenu}>
          <Link to="/signup">Sign Up</Link>
        </div>
        <div className="w-full h-full flex_center text-xl font-bold text-white filter brightness-200 contrast-200" onClick={toggleMenu}>
          <Link to="/login">Login</Link>
        </div>
      </div>
      <div className={`${isMenuOpen ? "w-full h-96 flex flex-col justify-evenly items-center md:max-w-[500px]" : "hidden"} `} onClick={toggleMenu}>
        <div className="w-16 h-full flex items-center text-xl font-bold filter brightness-200 text-[#d8923c] uppercase">
          <Link to="/">HOME</Link>
        </div>

        <button onClick={toggleLanguage} className="text-white">
          {language === "en" ? "Switch to Bengali" : "Switch to English"}
        </button>

        <div className="w-16 h-full flex items-center text-xl font-normal filter brightness-200 text-white uppercase" onClick={toggleMenu}>
          Contact
        </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
