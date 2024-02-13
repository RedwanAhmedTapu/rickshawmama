import { useEffect, useState } from "react";
import io from "socket.io-client";
import { useLocation } from "react-router-dom";
import axios from "axios";

const RickshawpullerDashboard = () => {
  const [rickshawpullerDetails, setRickshawpullerDetails] = useState(null);
  const [data, setData] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userNid = searchParams.get("userNid");

  const server = "https://backendofrickshawmama.onrender.com";
  // const server = "http://localhost:5001";
  const socket = io(server);

  useEffect(() => {
    // Replace with your Socket.IO server URL
    const fetchData = async () => {
      try {
        const res = await axios.get(`${server}/rickshawpuller/details`, {
          params: {
            nid: userNid,
          },
        });

        if (res) {
          setRickshawpullerDetails(res.data);
          console.log(res)
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData(); // Call the function immediately

    console.log("Fetching data...");

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

    socket.on("connect", () => {});

    socket.on("rickshawPullerLocationUpdate", async (data) => {
      console.log("Rickshawpuller location updated:", data);
      setData(true);
      setRickshawpullerDetails(data.rickshawpullerdata);
    });

    return () => {
      socket.disconnect();
    };
  }, [userNid, data]);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  return (
    <div className="container mx-auto p-8 w-full h-screen flex_center">
      <div className="w-96 h-96 sm:w-[60%] flex-col-center  bg-gradient-to-r from-blue-500 to-indigo-700 p-8 rounded-lg shadow-lg text-white">
        <h1 className="text-3xl font-bold mb-4 text-center">
          Rickshawpuller Dashboard
        </h1>

        {rickshawpullerDetails && (
          <div className="max-[600px]:flex_col_center sm:flex sm:justify-center lg:items-center space-x-4 lg:space-x-44 w-full">
            {rickshawpullerDetails.image && (
              <img
                src={rickshawpullerDetails.image}
                alt="Rickshawpuller"
                className="w-44 h-44 lg:w-72 lg:h-72 rounded-full border-4 border-white"
              />
            )}
            <div>
              <p className="text-lg max-[500px]:text-[1rem] sm:text-xl font-bold">
                Name: {rickshawpullerDetails.name || "N/A"}
              </p>
              <p className="text-lg max-[500px]:text-[1rem] sm:text-xl font-bold">
                Phone: {rickshawpullerDetails.phone || "N/A"}
              </p>
              <p className="text-lg max-[500px]:text-[1rem] sm:text-xl font-bold">
                NID: {rickshawpullerDetails.nid || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RickshawpullerDashboard;
