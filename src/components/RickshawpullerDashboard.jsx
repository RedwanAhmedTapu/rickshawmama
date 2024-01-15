import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";

const RickshawpullerDashboard = () => {
  const [rickshawpullerDetails, setRickshawpullerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userNid = searchParams.get("userNid");

  const server='https://backendofrickshawmama.onrender.com';


  useEffect(() => {
    const socket = io(server); // Replace with your Socket.IO server URL

    const emitRickshawmamaLocation = async () => {
      try {
        const position = await getCurrentLocation();
        const { latitude, longitude } = position.coords;

        socket.emit("updateRickshawmamaLocation", {
          userNid,
          lat: latitude,
          lon: longitude,
        });
      } catch (error) {
        console.error("Error getting rickshawmama location:", error.message);
      }
    };

    emitRickshawmamaLocation();

    socket.on("connect", () => {
      setLoading(false);
    });

    socket.on("rickshawPullerLocationUpdate", async (data) => {
      console.log("Rickshawpuller location updated:", data);
      setRickshawpullerDetails(data.rickshawpullerdata);
    });

    return () => {
      socket.disconnect();
    };
  }, [userNid]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="container mx-auto p-8 w-full h-full flex_center">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="w-96 h-96 flex_col_center ">
      <h1 className="sm:text-3xl font-bold mb-4 text-white text-2xl text-center">Rickshawpuller Dashboard</h1>

        
            <div className="flex items-center space-x-4">
              <img
                src={rickshawpullerDetails.image}
                alt="Rickshawpuller"
                className="w-44 h-44 rounded-full"
              />
              <div>
                <p className="text-lg font-bold">
                  Name: {rickshawpullerDetails.name}
                </p>
                <p className="text-gray-600">Phone: {rickshawpullerDetails.phone}</p>
                <p className="text-gray-600">NID: {rickshawpullerDetails.nid}</p>
              </div>
            </div>
          
        </div>
      )}
    </div>
  );
};

export default RickshawpullerDashboard;
