
import SectionRickshawImg from "../imgs/section-rickshaw-img.svg";
import { useNavigate } from "react-router-dom";
const EarnSection = () => {
const navigate=useNavigate();

  return (
    <section className=" bg-slate-50 -z-20  w-full h-[40rem] relative  earn-section flex_col_center p-12 ">
      <div className=" mx-auto w-full h-[50%] relative  flex_col_center pr-2">
        <div className="text-center flex_col_center">
          <h2 className="mb-10 text-3xl font-bold leading-tight">
            রিকশার মাধ্যমে আয় করুন
          </h2>
          <p className="mb-6">জয়েন করুন দেশের সর্বোচ্চ আয়ের প্ল্যাটফর্মে</p>
          <div  className="w-44 flex_center  h-16 bg-blue-500 hover:bg-blue-400 rounded-md shadow-lg text-center text-white cursor-pointer" onClick={()=>{
            navigate("/rickshawpuller-registration")
          }}>
            আয় শুরু করুন 
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-2 inline-block" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.293 5.293a1 1 0 011.414 0l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414-1.414L13.586 11H3a1 1 0 110-2h10.586L9.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full h-[50%]  flex_center">
       <img src={SectionRickshawImg} className="  bg-cover" alt="section-rickshaw-img"/>
      </div>
    </section>
  );
};

export default EarnSection;
