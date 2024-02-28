import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import debounce from "lodash/debounce";

const RickshawpullerDashboard = () => {
  const [rickshawpullerDetails, setRickshawpullerDetails] = useState(null);
  const [watchingPosition, setWatchingPosition] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const userNid = searchParams.get("userNid");
  const server = process.env.SERVER_URL;
  console.log(userNid)

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
      console.log(pos);

      const res = await axios.put(
        `${server}/rickshawpuller-update-location`,
        {
          userNid,
          lat: latitude,
          lon: longitude,
        }
      );

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

        return () => {
          navigator.geolocation.clearWatch(watchPositionId);
          setWatchingPosition(false);
        };
      } catch (error) {
        console.error("Error starting watch position:", error);
      }
    }
  };
  watchingPosition && alert("started sharing your position continuously");

  // Debounce the click handler to avoid frequent executions
  const startWatchingPositionDebounced = debounce(startWatchingPosition, 1000);

  const deleteRoute = async () => {
    try {
      const res = await axios.delete(`${server}/rickshawpuller/route-delete/${userNid}`);
      alert(res.data.message);
    } catch (error) {
      console.error("Error deleting route:", error);
      // Handle error appropriately, such as showing an error message to the user
    }
  };

  return (
    <div className="container mx-auto p-8 w-full h-screen flex_center relative top-12">
      <div className="w-96 h-[35rem] sm:w-[60%] flex-col-center bg-gradient-to-r from-blue-500 to-indigo-700 p-8 rounded-lg shadow-lg text-white">
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

        {/* Use the debounced click handler */}
        <div className=" w-full h-32 flex_center gap-x-12 ">
        <button className="w-32 h-16 bg-blue-400 hover:bg-blue-300 text-white rounded-sm shadow-lg p-1 text-center" onClick={startWatchingPositionDebounced}>
          Start Watching Position
        </button>
        <button className="w-32 h-16 bg-blue-400 hover:bg-blue-300 text-white rounded-sm shadow-lg p-1 text-center" onClick={deleteRoute}>

          Delete Your Route  
        </button>
        </div>
       
      </div>
    </div>
  );
};

export default RickshawpullerDashboard;
