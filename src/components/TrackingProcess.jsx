import roadSvgImg from "../imgs/roadSvg.svg";

const TrackingProcess = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center gap-1">
      <div className="flex flex-col justify-center items-center w-1/2 h-[30rem]  p-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg shadow-lg">
        <div className=" " style={{backgroundImage: `url(${roadSvgImg})`, backgroundSize: 'cover', backgroundPosition: 'center'}}>
          <h3 className="text-2xl font-bold mb-4 text-white">Follow these steps:</h3>
          <ol className="list-decimal pl-6 text-lg text-white">
            <li className="mb-4">Sign up to create an account</li>
            <li className="mb-4">Log in to authenticate your account</li>
            <li className="mb-4">Find nearby Rickshawmamas within 1km</li>
            <li className="mb-4">Click on the marker or location icon to choose</li>
            <li className="mb-4">View Rickshawmama{`'`}s phone number and image</li>
            <li className="mb-4">Call and track Rickshawmama{`'`}s location</li>
          </ol>
        </div>
      </div>
      <div className="w-1/2 h-[30rem] bg-slate-400 rounded-lg">
        <div className="h-full bg-gray-200 rounded-lg shadow-lg flex justify-center items-center">
          {/* Your video component can go here */}
        </div>
      </div>
    </div>
  );
};

export default TrackingProcess;
