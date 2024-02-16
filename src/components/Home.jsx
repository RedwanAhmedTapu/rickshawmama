
import { useEffect } from "react";
import Rickshaw from "../imgs/rickshaw.png";
import Corona from "../imgs/5.png";
import Star from "../imgs/star.png";
import DemandVsMonthsChart from "./DemandVsMonthsChart";
// import RiderTracker from "./RiderTracker";
import { useNavigate } from "react-router-dom";
// import TrigonometryQuiz from "./TrigonometryQuiz";
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();
  const data = [
    { month: 'Jan', demand: 100 },
    { month: 'Feb', demand: 150 },
    { month: 'Mar', demand: 120 },
    { month: 'apr', demand: 60 },
    { month: 'may', demand: 100 },
    { month: 'june', demand: 87 },
    { month: 'july', demand: 110 },
    { month: 'aug', demand: 110 },
    { month: 'sep', demand: 110 },
    { month: 'oct', demand: 130 },
    { month: 'nov', demand: 150 },
    { month: 'dec', demand: 90 },
  ];
  const navigate=useNavigate();


  useEffect(() => {
    if (navigator.geolocation) {
      localStorage.setItem('locationPermissionGranted', true);

    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []);
console.log(t)
  return (
    <>
     <div className="w-[55rem] h-[40rem] rotate-180 fixed -top-52 -right-44    overflow-hidden">
        <img src={Corona} className="w-full h-full   " />
      </div>
      <div className="w-[55rem] h-[40rem] rotate-180 fixed  -top-[22rem] -left-[27rem]    overflow-hidden">
        <img src={Star} className="w-full h-full   " />
      </div>
    <div className="w-screen  h-screen   bg-transparent relative top-[5rem] right-0  max-[999px]:flex_col_center flex_center  ">
      <div className=" max-[999px]:w-full w-[50%] h-full flex_col_center gap-y-16">
        <div className="text-[#F8A339] max-[459px]:text-4xl text-5xl lg:text-6xl font-bold uppercase">Rickshawmama</div>
        <div className="w-96 h-24 max-[390px]:w-64 flex_center justify-start gap-x-4 z-20">
            <div className="make_income_button make_ride_button relative cursor-pointer w-44 h-12 bg-[#F8A339] hover:bg-transparent  hover:border hover:border-[#F8A339] hover:text-white text-black font-semibold flex_center" onClick={()=>{navigate("/rickshawpuller-registration")}}>Make Income</div>
            <div className="make_ride_button relative cursor-pointer w-44 h-12 border-[0.1rem] border-[#F8A339] text-[#F8A339] font-semibold flex_center" onClick={()=>{navigate("/rider-login")}}>Make Ride</div>

        </div>
      </div>
      <div className=" max-[999px]:w-full w-[50%] h-full  z-10">
        <img src={Rickshaw} className="w-full h-full object-cover "/>
      </div>

    </div>
    
   
  
  <DemandVsMonthsChart data={data}/>
    {/* <RiderTracker/> */}
    {/* <TrigonometryQuiz/> */}
  
 
    </>
  );
};

export default Home;
