import { Link } from "react-router-dom";
const Nav = () => {
  return (
   <div className="w-[70rem] h-24 flex_around fixed z-20">
    <div className="w-44 h-24 flex_between">
        <div className="w-1/2 h-full flex_center text-xl  text-white font-bold"><Link to="/signup">sign up</Link></div>
        <div className="w-1/2 h-full flex_center text-xl font-bold text-white"><Link to="/login">login</Link></div>

    </div>
    <div className="w-96 h-24 flex_between">
        <div className="w-16 h-full flex_center text-xl font-bold text-[#F8A339] uppercase"><Link to="/">HOME</Link></div>
        <select className="w-16 h-full bg-none flex_center text-xl font-normal text-white uppercase"><option className="w-16 h-full flex_center text-xl font-normal text-white uppercase">English</option>
        <option className="w-16 h-full flex_center text-xl font-normal text-white uppercase">Bangla</option>
        </select>
        
        <div className="w-16 h-full flex_center text-xl font-normal text-white uppercase">contact</div>

    </div>

   </div>
  )
}

export default Nav;