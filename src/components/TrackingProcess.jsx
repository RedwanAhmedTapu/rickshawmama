import { useEffect, useRef } from 'react';
import roadSvgImg from "../imgs/roadSvg.svg";
import rickshawmamavideo from "../video/rickshawmamtracingprocessvideo.mp4";

const TrackingProcess = () => {
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
          <h3 className="text-2xl font-bold mb-4 text-white">Follow these steps:</h3>
          <ol className="list-decimal pl-6 text-lg text-white max-h-48 md:max-h-[800px] overflow-y-auto">
    <li className="mb-4 contrast-200">Sign up to create an account</li>
    <li className="mb-4 contrast-200">Log in to authenticate your account</li>
    <li className="mb-4">Find nearby Rickshawmamas within 1km</li>
    <li className="mb-4">Click on the marker or location icon to choose</li>
    <li className="mb-4">View phone number and image</li>
    <li className="mb-4">Call and track location</li>
</ol>

        </div>
      </div>
      <div className="w-full h-1/2 md:w-1/2 md:h-[30rem] bg-slate-400 rounded-lg relative overflow-hidden">
        <video loop autoPlay muted ref={videoRef} src={rickshawmamavideo} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
      </div>
    </div>
  );
};

export default TrackingProcess;
