import Rickshaw from "../imgs/rickshaw.png";
import Corona from "../imgs/5.png";
import Star from "../imgs/star.png";
import DemandVsMonthsChart from "./DemandVsMonthsChart";
import RiderTracker from "./RiderTracker";

const Home = () => {
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

  return (
    <>
     <div className="w-[55rem] h-[40rem] rotate-180 fixed -top-52 -right-44    overflow-hidden">
        <img src={Corona} className="w-full h-full   " />
      </div>
      <div className="w-[55rem] h-[40rem] rotate-180 fixed  -top-[22rem] -left-[27rem]    overflow-hidden">
        <img src={Star} className="w-full h-full   " />
      </div>
    <div className="w-full h-screen flex_center ">
      <div className="w-[50%] h-full flex_col_center gap-y-16">
        <div className="text-[#F8A339] text-6xl font-bold">RICKSHAWMAMA</div>
        <div className="w-96 h-24 flex_center justify-start gap-x-4">
            <div className="w-44 h-12 bg-[#F8A339] text-black font-semibold flex_center">Make Income</div>
            <div className="w-44 h-12 border-[0.1rem] border-[#F8A339] text-[#F8A339] font-semibold flex_center">Make Ride</div>

        </div>
      </div>
      <div className="w-[50%] h-full z-10">
        <img src={Rickshaw} className="w-full h-full object-cover "/>
      </div>

    </div>
    <DemandVsMonthsChart data={data}/>
    <RiderTracker/>
    </>
  );
};

export default Home;
