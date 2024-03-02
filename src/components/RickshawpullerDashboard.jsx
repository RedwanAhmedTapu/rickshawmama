import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";
import io from "socket.io-client"; // Import socket.io-client instead of WebSocket

const RickshawpullerDashboard = ({ currentLanguage }) => {
  const [rickshawpullerDetails, setRickshawpullerDetails] = useState(null);
  const [watchingPosition, setWatchingPosition] = useState(false);
  const [connectedUser, setConnectedUser] = useState(null); // State to store the total number of connected users
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userNid = searchParams.get("userNid");
  const server = process.env.SERVER_URL;

  useEffect(() => {
    const socket = io(server); // Connect to the Socket.IO server

    socket.on("connect", () => {
      // Send notification to pullers
      console.log("Connected to Socket.IO server");

      socket.on("connectedUsersCount", (data) => {
        setConnectedUser(data); // Update the connected user count in state
      });
    });

    return () => {
      socket.disconnect(); // Disconnect from the Socket.IO server when component unmounts
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${server}/rickshawpuller/details`, {
          params: {
            nid: userNid,
          },
        });

        if (res.data) {
          setRickshawpullerDetails(res.data);
          console.log(res.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();

    console.log("Fetching data...");
  }, [userNid]);

  const handleWatchPosition = async (pos) => {
    try {
      const { latitude, longitude } = pos.coords;

      const res = await axios.put(`${server}/rickshawpuller-update-location`, {
        userNid,
        lat: latitude,
        lon: longitude,
      });

      console.log(res.data.message);
    } catch (error) {
      console.error("Error getting rickshawmama location:", error.message);
    }
  };

  const startWatchingPosition = async () => {
    if (!watchingPosition) {
      try {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            handleWatchPosition(pos);
          },
          (error) => {
            console.error("Error getting current position:", error);
          },
          { enableHighAccuracy: true }
        );

        const watchPositionId = navigator.geolocation.watchPosition(
          handleWatchPosition,
          (error) => {
            console.error("Error getting current position:", error);
          },
          { enableHighAccuracy: true }
        );

        setWatchingPosition(true);
        const fetchData = async () => {
          try {
            const res = await axios.put(
              `${server}/rickshawpuller/permit/${userNid}`
            );

            if (res.data) {
              console.log(res.data);
            }
          } catch (error) {
            console.error("Error fetching data:", error.message);
          }
        };

        fetchData();

        return () => {
          navigator.geolocation.clearWatch(watchPositionId);
          setWatchingPosition(false);
        };
      } catch (error) {
        console.error("Error starting watch position:", error);
      }
    }
  };

  const startWatchingPositionDebounced = debounce(startWatchingPosition, 1000);

  const deleteRoute = async () => {
    try {
      const res = await axios.delete(
        `${server}/rickshawpuller/route-delete/${userNid}`
      );
      alert(res.data.message);
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const stopWatchingPosition = async () => {
    try {
      const res = await axios.put(
        `${server}/rickshawpuller/permit-deny/${userNid}`
      );

      if (res.data) {
        setWatchingPosition(false);
        console.log(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  return (
    <>
      <div className="container mx-auto p-8 w-full h-screen flex_center relative top-8">
        
        <div className="w-96 h-[40rem] sm:h-full sm:w-[60%] flex-col-center bg-gradient-to-r from-blue-500 to-indigo-700 p-8 rounded-lg shadow-lg text-white">
          <div className="w-full flex_center">
        <div className="w-96 mt-8 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg p-4">
        <h1 className="text-xl text-black ">
          {currentLanguage === "en" ? "Total Connected Users" : "মোট সংযুক্ত ব্যবহারকারী"}: {connectedUser}
        </h1>
      </div>
      </div>
          <h1 className="text-3xl font-bold mb-4 text-center">
            {currentLanguage === "en" ? "Rickshawpuller Dashboard" : "রিকশা চালক ড্যাশবোর্ড"}
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
                  {currentLanguage === "en" ? "Name" : "নাম"}: {rickshawpullerDetails.name || "N/A"}
                </p>
                <p className="text-lg max-[500px]:text-[1rem] sm:text-xl font-bold">
                  {currentLanguage === "en" ? "Phone" : "ফোন"}: {rickshawpullerDetails.phone || "N/A"}
                </p>
                <p className="text-lg max-[500px]:text-[1rem] sm:text-xl font-bold">
                  {currentLanguage === "en" ? "NID" : "এনআইডি"}: {rickshawpullerDetails.nid || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Use the debounced click handler */}
          <div className=" w-full h-32 flex_center gap-x-12 ">
            {watchingPosition ? (
              <button
                className="w-32 h-16 bg-blue-400 hover:bg-blue-300 text-white rounded-sm shadow-lg p-1 text-center"
                onClick={stopWatchingPosition}
              >
                {currentLanguage === "en" ? "Stop Sharing Position" : "পজিশন শেয়ারিং বন্ধ করুন"}
              </button>
            ) : (
              <button
                className="w-32 h-16 bg-blue-400 hover:bg-blue-300 text-white rounded-sm shadow-lg p-1 text-center"
                onClick={startWatchingPositionDebounced}
              >
                {currentLanguage === "en" ? "Start Watching Position" : "পজিশন শেয়ার শুরু করুন"}
              </button>
            )}
            <button
              className="w-32 h-16 bg-blue-400 hover:bg-blue-300 text-white rounded-sm shadow-lg p-1 text-center"
              onClick={deleteRoute}
            >
              {currentLanguage === "en" ? "Delete Your Route" : "আপনার রুট মুছুন"}
            </button>
          </div>
        </div>
      </div>
      
    </>
  );
};

export default RickshawpullerDashboard;
