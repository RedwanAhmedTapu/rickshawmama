import { useEffect, useRef } from 'react';
import roadSvgImg from "../imgs/roadSvg.svg";
import rickshawmamavideo from "../video/rickshawmamtracingprocessvideo.mp4";

const TrackingProcess = ({ currentLanguage }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    // Play the video when the component mounts
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="w-full h-screen p-4 sm:p-0 
    flex flex-col justify-center items-center 
    md:flex md:justify-center md:items-center md:flex-row gap-1 
    bg-gradient-to-r from-blue-400 to-purple-500 relative ">

      <div className="flex flex-col justify-center items-center w-full h-1/2 md:w-1/2 md:h-[30rem] p-2  rounded-lg overflow-hidden">
        <div className="" style={{backgroundImage: `url(${roadSvgImg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <h3 className="text-2xl font-bold mb-4 text-white">
            {currentLanguage === "en" ? "Follow these steps:" : "এই ধাপগুলি অনুসরণ করুন:"}
          </h3>
          <ol className="list-decimal pl-6 text-lg text-white max-h-48 md:max-h-[800px] overflow-y-auto">
            <li className="mb-4">
              {currentLanguage === "en" ? "Sign up to create an account" : "একটি অ্যাকাউন্ট তৈরি করতে সাইন আপ করুন"}
            </li>
            <li className="mb-4">
              {currentLanguage === "en" ? "Log in to authenticate your account" : "আপনার অ্যাকাউন্টের প্রমাণীকরণের জন্য লগইন করুন"}
            </li>
            <li className="mb-4">
              {currentLanguage === "en" ? "Find nearby Rickshawmamas within 1km" : "১কিমিতে কাছাকাছি রিকশামামা খুঁজুন"}
            </li>
            <li className="mb-4">
              {currentLanguage === "en" ? "Click on the marker or location icon to choose" : "চিহ্নিত করার জন্য মার্কার বা অবস্থান আইকনে ক্লিক করুন"}
            </li>
            <li className="mb-4">
              {currentLanguage === "en" ? "View phone number and image" : "ফোন নম্বর এবং ইমেজ দেখুন"}
            </li>
            <li className="mb-4">
              {currentLanguage === "en" ? "Call and track location" : "ফোন করুন এবং অবস্থান ট্র্যাক করুন"}
            </li>
          </ol>
        </div>
      </div>
      <div className="w-full h-1/2 md:w-1/2 md:h-[30rem] flex_center rounded-lg relative overflow-hidden ">
        <video loop autoPlay muted ref={videoRef} src={rickshawmamavideo} className="absolute inset-0 w-[95%] h-[95%] object-cover rounded-lg" />
      </div>
    </div>
  );
};

export default TrackingProcess;
