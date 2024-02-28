import { useState } from "react";
import { Link } from "react-router-dom";

const Nav = ({ currentLanguage, switchLanguage }) => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  console.log(currentLanguage);
  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={`w-full h-24 flex justify-around fixed  top-4 z-50 ${
        isMenuOpen ? "h-screen" : ""
      }`}
    >
      <div className="w-44 h-24 flex justify-between items-center md:max-w-[500px] max-[1000px]:hidden">
        <div className="w-1/2 h-full flex items-center text-xl  text-white font-bold">
          <Link to="/signup">
            {currentLanguage === "en" ? "Signup" : "নিবন্ধন"}
          </Link>
        </div>
        <div className="w-1/2 h-full flex items-center text-xl font-bold text-white">
          <Link to="/login">{currentLanguage === "en" ? "Login" : "লগইন"}</Link>
        </div>
      </div>
      <div className="w-96 h-24 flex justify-between items-center md:max-w-[500px] max-[1000px]:hidden">
        <div className="w-16 h-full flex items-center text-xl font-bold text-[#F8A339] uppercase">
          <Link to="/">{currentLanguage === "en" ? "HOME" : "হোম"}</Link>
        </div>

        <select
          value={currentLanguage}
          onChange={switchLanguage}
          className="text-white bg-blue-500 px-4 py-2 rounded-md border-2 shadow-md cursor-pointer"
        >
          <option value="en">English</option>
          <option value="bn">Bengali</option>
        </select>

        <div className="w-16 h-full flex items-center text-xl font-normal text-white uppercase">
          {currentLanguage === "en" ? "Contact" : "যোগাযোগ"}
        </div>
      </div>

      {/* Menu Icon */}
      <div
        className="cursor-pointer w-8 h-8 flex items-center justify-center text-white absolute top-4 right-4 md:hidden"
        style={{ zIndex: 100 }}
      >
        <div
          className={`menu-icon ${isMenuOpen ? "menu-open" : ""}`}
          onClick={toggleMenu}
        ></div>
      </div>

      {/* Menu Content */}
      <div
        className={`${
          isMenuOpen
            ? "w-full h-screen transition-all divide-y-2 duration-1000 absolute top-12 bg-[#000] opacity-80 z-50 filter brightness-200 flex-col justify-evenly items-start min-[760px]:hidden"
            : "h-0"
        }`}
      >
        <div
          className={`${
            isMenuOpen
              ? "w-full  h-32 flex flex-col justify-start items-start  py-4 gap-y-1 divide-y-2  filter brightness-200"
              : "hidden"
          }`}
        >
          <div
            className="w-full h-full  text-xl px-3 py-2  text-white filter brightness-200 font-bold"
            onClick={toggleMenu}
          >
            <Link to="/signup">
              {currentLanguage === "en" ? "Signup" : "নিবন্ধন"}
            </Link>
          </div>
          <div
            className="w-full h-full px-3 py-2  text-xl font-bold text-white filter brightness-200 contrast-200"
            onClick={toggleMenu}
          >
            <Link to="/login">
              {currentLanguage === "en" ? "Login" : "লগইন"}
            </Link>
          </div>
        </div>
        <div
          className={`${
            isMenuOpen
              ? "w-full h-[40%]  flex flex-col justify-between items-start px-3  md:max-w-[500px]"
              : "hidden"
          } `}
          onClick={toggleMenu}
        >
          <div className="w-16 h-full flex items-center text-xl font-bold filter brightness-200 text-[#d8923c] uppercase">
            <Link to="/">{currentLanguage === "en" ? "HOME" : "হোম"}</Link>
          </div>

          <button onClick={switchLanguage} className="text-white">
            {currentLanguage === "en"
              ? "Switch to Bengali"
              : "ইংরেজি চালিয়ে যান"}
          </button>

          <div
            className="w-16 h-full flex items-center text-xl font-normal filter brightness-200 text-white uppercase"
            onClick={toggleMenu}
          >
            {currentLanguage === "en" ? "Contact" : "যোগাযোগ"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nav;
